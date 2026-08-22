import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdatePrivacyDto {
  @ApiPropertyOptional({
    example: 'private',
    description: 'Default resume visibility (private / public)',
  })
  @IsOptional()
  @IsString()
  defaultResumeVisibility?: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Allow search engine indexing for public resumes',
  })
  @IsOptional()
  @IsBoolean()
  allowSearchIndexing?: boolean;

  @ApiPropertyOptional({
    example: true,
    description: 'Show email address on public resume view',
  })
  @IsOptional()
  @IsBoolean()
  showEmailOnPublicResume?: boolean;

  @ApiPropertyOptional({
    example: false,
    description: 'Show phone number on public resume view',
  })
  @IsOptional()
  @IsBoolean()
  showPhoneOnPublicResume?: boolean;
}
