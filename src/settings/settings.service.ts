import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import { UpdatePrivacyDto } from './dto/update-privacy.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get or initialize user settings and user profile details
   */
  async getSettings(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        settings: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Auto-create settings record if not exists
    let settings = user.settings;
    if (!settings) {
      settings = await this.prisma.userSettings.create({
        data: {
          userId,
        },
      });
    }

    return {
      profile: {
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: settings.bio,
        phone: settings.phone,
        location: settings.location,
        isVerified: user.isVerified,
      },
      account: {
        email: user.email,
        isGoogleAccount: Boolean(user.googleId),
        hasPassword: Boolean(user.password),
        role: user.role,
        createdAt: user.createdAt,
      },
      preferences: {
        language: settings.language,
        theme: settings.theme,
        emailNotifications: settings.emailNotifications,
        defaultTemplate: settings.defaultTemplate,
        autoSaveInterval: settings.autoSaveInterval,
      },
      privacy: {
        defaultResumeVisibility: settings.defaultResumeVisibility,
        allowSearchIndexing: settings.allowSearchIndexing,
        showEmailOnPublicResume: settings.showEmailOnPublicResume,
        showPhoneOnPublicResume: settings.showPhoneOnPublicResume,
      },
    };
  }

  /**
   * Update Profile Settings (name, avatar, bio, phone, location)
   */
  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    // Update user record
    if (dto.name !== undefined || dto.avatar !== undefined) {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          ...(dto.name !== undefined && { name: dto.name }),
          ...(dto.avatar !== undefined && { avatar: dto.avatar }),
        },
      });
    }

    // Update or upsert settings record
    await this.prisma.userSettings.upsert({
      where: { userId },
      create: {
        userId,
        bio: dto.bio || null,
        phone: dto.phone || null,
        location: dto.location || null,
      },
      update: {
        ...(dto.bio !== undefined && { bio: dto.bio }),
        ...(dto.phone !== undefined && { phone: dto.phone }),
        ...(dto.location !== undefined && { location: dto.location }),
      },
    });

    return this.getSettings(userId);
  }

  /**
   * Change Account Password
   */
  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    if (!user.password) {
      throw new BadRequestException(
        'Google OAuth accounts cannot change password directly. Please set up password authentication or login via Google.',
      );
    }

    const isMatch = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Password updated successfully' };
  }

  /**
   * Update Preference Settings
   */
  async updatePreferences(userId: string, dto: UpdatePreferencesDto) {
    await this.prisma.userSettings.upsert({
      where: { userId },
      create: {
        userId,
        ...(dto.language && { language: dto.language }),
        ...(dto.theme && { theme: dto.theme }),
        ...(dto.emailNotifications !== undefined && {
          emailNotifications: dto.emailNotifications,
        }),
        ...(dto.defaultTemplate && { defaultTemplate: dto.defaultTemplate }),
        ...(dto.autoSaveInterval !== undefined && {
          autoSaveInterval: dto.autoSaveInterval,
        }),
      },
      update: {
        ...(dto.language && { language: dto.language }),
        ...(dto.theme && { theme: dto.theme }),
        ...(dto.emailNotifications !== undefined && {
          emailNotifications: dto.emailNotifications,
        }),
        ...(dto.defaultTemplate && { defaultTemplate: dto.defaultTemplate }),
        ...(dto.autoSaveInterval !== undefined && {
          autoSaveInterval: dto.autoSaveInterval,
        }),
      },
    });

    return this.getSettings(userId);
  }

  /**
   * Update Privacy Settings
   */
  async updatePrivacy(userId: string, dto: UpdatePrivacyDto) {
    await this.prisma.userSettings.upsert({
      where: { userId },
      create: {
        userId,
        ...(dto.defaultResumeVisibility && {
          defaultResumeVisibility: dto.defaultResumeVisibility,
        }),
        ...(dto.allowSearchIndexing !== undefined && {
          allowSearchIndexing: dto.allowSearchIndexing,
        }),
        ...(dto.showEmailOnPublicResume !== undefined && {
          showEmailOnPublicResume: dto.showEmailOnPublicResume,
        }),
        ...(dto.showPhoneOnPublicResume !== undefined && {
          showPhoneOnPublicResume: dto.showPhoneOnPublicResume,
        }),
      },
      update: {
        ...(dto.defaultResumeVisibility && {
          defaultResumeVisibility: dto.defaultResumeVisibility,
        }),
        ...(dto.allowSearchIndexing !== undefined && {
          allowSearchIndexing: dto.allowSearchIndexing,
        }),
        ...(dto.showEmailOnPublicResume !== undefined && {
          showEmailOnPublicResume: dto.showEmailOnPublicResume,
        }),
        ...(dto.showPhoneOnPublicResume !== undefined && {
          showPhoneOnPublicResume: dto.showPhoneOnPublicResume,
        }),
      },
    });

    return this.getSettings(userId);
  }

  /**
   * Export all user account data, settings, and resumes
   */
  async exportData(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        isVerified: true,
        createdAt: true,
        settings: true,
        resumes: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    return {
      exportTimestamp: new Date().toISOString(),
      userProfile: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
      },
      settings: user.settings,
      totalResumes: user.resumes.length,
      resumes: user.resumes,
    };
  }
}
