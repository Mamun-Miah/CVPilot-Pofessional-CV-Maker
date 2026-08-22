import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateResumeDto } from './create-resume.dto';

export class UpdateResumeDto extends PartialType(CreateResumeDto) {
  @ApiPropertyOptional({
    example: true,
    description: 'Whether the resume is publicly viewable via slug',
  })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @ApiPropertyOptional({
    example: 'rahim-ahmed-senior-dev',
    description: 'Unique custom URL slug for public sharing',
  })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({
    example: 95,
    description: 'Calculated or manually assigned ATS score (0-100)',
  })
  @IsOptional()
  @IsNumber()
  atsScore?: number;
}
