import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyForgotPasswordOtpDto } from './dto/verify-forgot-password-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import {
  AuthResponseDto,
  ForgotPasswordVerifyResponseDto,
  MessageResponseDto,
  UserProfileDto,
} from './dto/auth-response.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { GoogleLoginDto } from './dto/google-login.dto';
import { GetUser } from './decorators/get-user.decorator';
import type { UserPayload } from './interfaces/user-payload.interface';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Register a new user account' })
  @ApiResponse({
    status: 201,
    description: 'Registration successful, verification OTP sent via email',
    type: MessageResponseDto,
  })
  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<MessageResponseDto> {
    return this.authService.register(registerDto);
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Verify email address with OTP code' })
  @ApiResponse({
    status: 200,
    description:
      'Email verified successfully, returns access token and user profile',
    type: AuthResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('verify-email')
  async verifyEmail(
    @Body() verifyEmailDto: VerifyEmailDto,
  ): Promise<AuthResponseDto> {
    return this.authService.verifyEmail(verifyEmailDto);
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Resend email verification OTP code' })
  @ApiResponse({
    status: 200,
    description: 'New verification OTP sent to email',
    type: MessageResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('resend-otp')
  async resendOtp(
    @Body() resendOtpDto: ResendOtpDto,
  ): Promise<MessageResponseDto> {
    return this.authService.resendOtp(resendOtpDto);
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Log in with credentials' })
  @ApiResponse({
    status: 200,
    description: 'Login successful, returns access token and user profile',
    type: AuthResponseDto,
  })
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(
    @Body() _loginDto: LoginDto,
    @GetUser() user: UserPayload,
  ): AuthResponseDto {
    return this.authService.login(user);
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Request password reset OTP code' })
  @ApiResponse({
    status: 200,
    description: 'Password reset OTP sent if account exists',
    type: MessageResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('forgot-password')
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<MessageResponseDto> {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Verify password reset OTP code' })
  @ApiResponse({
    status: 200,
    description: 'OTP verified, returns password reset token',
    type: ForgotPasswordVerifyResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('verify-forgot-password-otp')
  async verifyForgotPasswordOtp(
    @Body() verifyForgotPasswordOtpDto: VerifyForgotPasswordOtpDto,
  ): Promise<ForgotPasswordVerifyResponseDto> {
    return this.authService.verifyForgotPasswordOtp(verifyForgotPasswordOtpDto);
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Reset password using reset token' })
  @ApiResponse({
    status: 200,
    description: 'Password reset successful',
    type: MessageResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<MessageResponseDto> {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @ApiOperation({ summary: 'Get current user profile' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 200,
    description: 'Current user profile retrieved',
    type: UserProfileDto,
  })
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@GetUser() user: UserPayload): UserPayload {
    return user;
  }

  @ApiOperation({ summary: 'Initiate Google OAuth2 authentication flow' })
  @UseGuards(GoogleAuthGuard)
  @Get('google')
  async googleAuth() {
    // Guard redirects to Google OAuth2 consent screen
  }

  @ApiOperation({ summary: 'Google OAuth2 callback endpoint' })
  @ApiResponse({
    status: 200,
    description:
      'Google authentication successful, returns JWT access token and user profile',
    type: AuthResponseDto,
  })
  @UseGuards(GoogleAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('google/callback')
  googleAuthCallback(@GetUser() user: UserPayload): AuthResponseDto {
    return this.authService.login(user);
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({
    summary: 'Log in using a Google ID token from client application',
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful, returns access token and user profile',
    type: AuthResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('google')
  async googleTokenLogin(
    @Body() googleLoginDto: GoogleLoginDto,
  ): Promise<AuthResponseDto> {
    return this.authService.loginWithGoogleIdToken(googleLoginDto);
  }
}
