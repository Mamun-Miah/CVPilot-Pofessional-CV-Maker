import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import { UpdatePrivacyDto } from './dto/update-privacy.dto';

@ApiTags('settings')
@Controller('settings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all user settings',
    description:
      'Fetches profile information, account details, preferences (language, theme, template, autosave), and privacy configuration.',
  })
  @ApiResponse({
    status: 200,
    description: 'Settings returned successfully.',
  })
  async getSettings(@GetUser('id') userId: string) {
    const result = await this.settingsService.getSettings(userId);
    return result;
  }

  @Patch('profile')
  @ApiOperation({
    summary: 'Update user profile settings',
    description:
      'Updates full name, avatar URL, bio, phone number, and location.',
  })
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully.',
  })
  async updateProfile(
    @GetUser('id') userId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    const result = await this.settingsService.updateProfile(userId, dto);
    return result;
  }

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Change account password',
    description:
      'Validates current password and updates to a new password for password-authenticated users.',
  })
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Password changed successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Incorrect current password or Google account restriction.',
  })
  async changePassword(
    @GetUser('id') userId: string,
    @Body() dto: ChangePasswordDto,
  ) {
    const result = await this.settingsService.changePassword(userId, dto);
    return result;
  }

  @Patch('preferences')
  @ApiOperation({
    summary: 'Update application preferences',
    description:
      'Configures UI theme (light/dark/system), language (en/bn), default template, email notification toggle, and autosave interval.',
  })
  @ApiBody({ type: UpdatePreferencesDto })
  @ApiResponse({
    status: 200,
    description: 'Preferences updated successfully.',
  })
  async updatePreferences(
    @GetUser('id') userId: string,
    @Body() dto: UpdatePreferencesDto,
  ) {
    const result = await this.settingsService.updatePreferences(userId, dto);
    return result;
  }

  @Patch('privacy')
  @ApiOperation({
    summary: 'Update privacy settings',
    description:
      'Configures default resume visibility (private/public), search engine indexing allowance, and contact info visibility on public view.',
  })
  @ApiBody({ type: UpdatePrivacyDto })
  @ApiResponse({
    status: 200,
    description: 'Privacy settings updated successfully.',
  })
  async updatePrivacy(
    @GetUser('id') userId: string,
    @Body() dto: UpdatePrivacyDto,
  ) {
    const result = await this.settingsService.updatePrivacy(userId, dto);
    return result;
  }

  @Get('export-data')
  @ApiOperation({
    summary: 'Export all user account data and resumes',
    description:
      'Generates a full JSON export of the user profile, settings, and all created resumes.',
  })
  @ApiResponse({
    status: 200,
    description: 'Data export generated successfully.',
  })
  async exportData(@GetUser('id') userId: string) {
    const result = await this.settingsService.exportData(userId);
    return result;
  }
}
