import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { createHash, randomInt } from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import { PrismaService } from '../prisma.service';
import { MailService } from '../mail/mail.service';
import { RegisterDto } from './dto/register.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyForgotPasswordOtpDto } from './dto/verify-forgot-password-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { GoogleLoginDto } from './dto/google-login.dto';
import {
  AuthResponseDto,
  ForgotPasswordVerifyResponseDto,
  MessageResponseDto,
} from './dto/auth-response.dto';
import { UserPayload } from './interfaces/user-payload.interface';
import { OtpType } from '@prisma/client';

export interface ResetPasswordJwtPayload {
  email: string;
  purpose: string;
}

export interface GoogleTokenPayload {
  sub: string;
  email?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {}

  private generateOtpCode(): string {
    return randomInt(100000, 1000000).toString();
  }

  private hashOtp(otp: string): string {
    return createHash('sha256').update(otp).digest('hex');
  }

  private async createAndSendOtp(email: string, type: OtpType): Promise<void> {
    const recentOtp = await this.prisma.otp.findFirst({
      where: {
        email,
        type,
        createdAt: { gt: new Date(Date.now() - 60 * 1000) },
      },
    });

    if (recentOtp) {
      throw new BadRequestException(
        'Please wait at least 60 seconds before requesting another OTP code.',
      );
    }

    await this.prisma.otp.updateMany({
      where: {
        email,
        type,
        used: false,
      },
      data: { used: true },
    });

    const otp = this.generateOtpCode();
    const hashedOtp = this.hashOtp(otp);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await this.prisma.otp.create({
      data: {
        email,
        otp: hashedOtp,
        type,
        expiresAt,
      },
    });

    await this.mailService.sendOtpEmail(email, otp, type);
  }

  private async verifyAndBurnOtp(
    email: string,
    rawOtp: string,
    type: OtpType,
  ): Promise<void> {
    const hashedOtp = this.hashOtp(rawOtp);

    const otpRecord = await this.prisma.otp.findFirst({
      where: {
        email,
        otp: hashedOtp,
        type,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord) {
      throw new BadRequestException('Invalid or expired OTP code.');
    }

    await this.prisma.otp.update({
      where: { id: otpRecord.id },
      data: { used: true },
    });
  }

  async register(registerDto: RegisterDto): Promise<MessageResponseDto> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser && existingUser.isVerified) {
      throw new ConflictException(
        'User with this email already exists and is verified.',
      );
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    if (existingUser && !existingUser.isVerified) {
      await this.prisma.user.update({
        where: { id: existingUser.id },
        data: {
          password: hashedPassword,
          name: registerDto.name,
        },
      });
    } else {
      await this.prisma.user.create({
        data: {
          email: registerDto.email,
          password: hashedPassword,
          name: registerDto.name,
          isVerified: false,
        },
      });
    }

    await this.createAndSendOtp(registerDto.email, OtpType.VERIFY_EMAIL);

    return {
      message:
        'Registration successful. An OTP code has been sent to your email for verification.',
    };
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<AuthResponseDto> {
    await this.verifyAndBurnOtp(
      verifyEmailDto.email,
      verifyEmailDto.otp,
      OtpType.VERIFY_EMAIL,
    );

    const user = await this.prisma.user.update({
      where: { email: verifyEmailDto.email },
      data: { isVerified: true },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        googleId: true,
        role: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const token = this.generateJwtToken(user.id, user.email);

    return {
      user,
      access_token: token,
    };
  }

  async resendOtp(resendOtpDto: ResendOtpDto): Promise<MessageResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { email: resendOtpDto.email },
    });

    if (!user) {
      throw new BadRequestException('User not found.');
    }

    if (user.isVerified) {
      throw new BadRequestException('Email address is already verified.');
    }

    await this.createAndSendOtp(resendOtpDto.email, OtpType.VERIFY_EMAIL);

    return {
      message: 'A new verification OTP has been sent to your email.',
    };
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserPayload | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    if (!user.isVerified) {
      throw new UnauthorizedException(
        'Email address is not verified. Please verify your OTP first.',
      );
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      googleId: user.googleId,
      role: user.role,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  login(user: UserPayload): AuthResponseDto {
    const token = this.generateJwtToken(user.id, user.email);
    return {
      user,
      access_token: token,
    };
  }

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<MessageResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { email: forgotPasswordDto.email },
    });

    if (user) {
      await this.createAndSendOtp(
        forgotPasswordDto.email,
        OtpType.FORGOT_PASSWORD,
      );
    }

    return {
      message:
        'If an account with that email exists, a password reset OTP has been sent.',
    };
  }

  async verifyForgotPasswordOtp(
    verifyDto: VerifyForgotPasswordOtpDto,
  ): Promise<ForgotPasswordVerifyResponseDto> {
    await this.verifyAndBurnOtp(
      verifyDto.email,
      verifyDto.otp,
      OtpType.FORGOT_PASSWORD,
    );

    const resetToken = this.jwtService.sign(
      { email: verifyDto.email, purpose: 'password_reset' },
      { expiresIn: '15m' },
    );

    return {
      message:
        'OTP verified successfully. You may now reset your password using the provided reset_token.',
      reset_token: resetToken,
    };
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<MessageResponseDto> {
    let payload: ResetPasswordJwtPayload;

    try {
      payload = this.jwtService.verify<ResetPasswordJwtPayload>(
        resetPasswordDto.resetToken,
      );
    } catch {
      throw new UnauthorizedException(
        'Invalid or expired reset token. You must verify OTP first.',
      );
    }

    if (
      payload.purpose !== 'password_reset' ||
      payload.email !== resetPasswordDto.email
    ) {
      throw new UnauthorizedException(
        'Invalid reset token for this email address.',
      );
    }

    const hashedPassword = await bcrypt.hash(resetPasswordDto.newPassword, 10);

    await this.prisma.user.update({
      where: { email: resetPasswordDto.email },
      data: { password: hashedPassword },
    });

    return {
      message:
        'Password reset successful. You may now log in with your new password.',
    };
  }

  generateJwtToken(userId: string, email: string): string {
    const payload = { sub: userId, email };
    return this.jwtService.sign(payload);
  }

  async validateGoogleUser(googleProfile: {
    googleId: string;
    email: string;
    name?: string | null;
    avatar?: string | null;
  }): Promise<UserPayload> {
    const { googleId, email, name, avatar } = googleProfile;

    let user = await this.prisma.user.findFirst({
      where: {
        OR: [{ googleId }, { email }],
      },
    });

    if (user) {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          googleId: user.googleId || googleId,
          isVerified: true,
          name: user.name || name || undefined,
          avatar: user.avatar || avatar || undefined,
        },
      });
    } else {
      user = await this.prisma.user.create({
        data: {
          email,
          googleId,
          name: name || null,
          avatar: avatar || null,
          isVerified: true,
        },
      });
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      googleId: user.googleId,
      role: user.role,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async loginWithGoogleIdToken(
    googleLoginDto: GoogleLoginDto,
  ): Promise<AuthResponseDto> {
    const googleClientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    const client = new OAuth2Client(googleClientId);

    let payload: GoogleTokenPayload | undefined;
    try {
      const ticket = await client.verifyIdToken({
        idToken: googleLoginDto.idToken,
        audience: googleClientId || undefined,
      });
      payload = ticket.getPayload();
    } catch {
      throw new UnauthorizedException('Invalid Google ID token.');
    }
    if (!payload || !payload.email) {
      throw new UnauthorizedException('Invalid payload in Google ID token.');
    }

    const name =
      payload.name ||
      `${payload.given_name || ''} ${payload.family_name || ''}`.trim() ||
      null;

    const user = await this.validateGoogleUser({
      googleId: payload.sub,
      email: payload.email,
      name,
      avatar: payload.picture || null,
    });

    return this.login(user);
  }
}
