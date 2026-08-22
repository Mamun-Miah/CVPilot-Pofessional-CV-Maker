import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdatePreferencesDto {
  @ApiPropertyOptional({
    example: 'en',
    description: 'Interface language (en / bn)',
  })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional({
    example: 'system',
    description: 'UI Theme (light / dark / system)',
  })
  @IsOptional()
  @IsString()
  theme?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Enable email notifications & updates',
  })
  @IsOptional()
  @IsBoolean()
  emailNotifications?: boolean;

  @ApiPropertyOptional({
    example: 'modern-professional',
    description: 'Default template ID',
  })
  @IsOptional()
  @IsString()
  defaultTemplate?: string;

  @ApiPropertyOptional({
    example: 30,
    description: 'Autosave interval in seconds',
  })
  @IsOptional()
  @IsNumber()
  autoSaveInterval?: number;
}
