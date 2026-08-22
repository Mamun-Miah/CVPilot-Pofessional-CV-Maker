import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class MailService implements OnModuleInit {
  private readonly logger = new Logger(MailService.name);
  private transporter: Transporter;

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get<string>('SMTP_HOST');
    const port = Number(this.configService.get<number>('SMTP_PORT')) || 587;
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASS');
    const secure =
      this.configService.get<string>('SMTP_SECURE') === 'true' || port === 465;

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: { user, pass },
        tls: {
          rejectUnauthorized: process.env.NODE_ENV === 'production',
        },
      });
    } else {
      this.logger.warn(
        'SMTP credentials not configured in environment. Using fallback logger transport.',
      );
      this.transporter = nodemailer.createTransport({
        streamTransport: true,
        newline: 'unix',
        buffer: true,
      });
    }
  }

  async onModuleInit() {
    const host = this.configService.get<string>('SMTP_HOST');
    if (host) {
      try {
        await this.transporter.verify();
        this.logger.log('SMTP mail server connection verified successfully.');
      } catch (err) {
        this.logger.error(
          `SMTP mail server verification failed: ${(err as Error).message}`,
        );
      }
    }
  }

  async sendOtpEmail(
    to: string,
    otp: string,
    type: 'VERIFY_EMAIL' | 'FORGOT_PASSWORD',
  ): Promise<void> {
    const from =
      this.configService.get<string>('SMTP_FROM') ||
      '"CV Pilot Security" <noreply@cvpilot.com>';
    const isVerification = type === 'VERIFY_EMAIL';
    const subject = isVerification
      ? 'Verify Your Email Address - CV Pilot'
      : 'Password Reset Request - CV Pilot';

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #1e293b; margin: 0; font-size: 24px;">CV Pilot Security</h2>
        </div>
        <p style="color: #334155; font-size: 16px; line-height: 1.5;">Hello,</p>
        <p style="color: #334155; font-size: 16px; line-height: 1.5;">${
          isVerification
            ? 'Thank you for registering! Please use the following One-Time Password (OTP) code to verify your email address:'
            : 'You requested a password reset. Please use the following One-Time Password (OTP) code to proceed:'
        }</p>
        <div style="text-align: center; margin: 32px 0;">
          <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #2563eb; background-color: #f1f5f9; padding: 16px 32px; border-radius: 8px; display: inline-block; font-family: monospace;">${otp}</span>
        </div>
        <p style="color: #64748b; font-size: 14px; line-height: 1.5;">This OTP is valid for <strong>10 minutes</strong>. If you did not request this code, please ignore this email or secure your account if you suspect unauthorized activity.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">&copy; CV Pilot Authentication System. All rights reserved.</p>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from,
        to,
        subject,
        html: htmlContent,
      });
      this.logger.log(`OTP email sent successfully to ${to} (${type})`);
    } catch (error) {
      this.logger.error(
        `Failed to send OTP email to ${to}: ${(error as Error).message}`,
      );
    }
  }
}
