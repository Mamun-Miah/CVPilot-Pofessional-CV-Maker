import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserStatusDto {
  @ApiPropertyOptional({
    example: 'suspended',
    description: 'User status (active / suspended)',
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({
    example: 'admin',
    description: 'User role (user / admin / superadmin)',
  })
  @IsOptional()
  @IsString()
  role?: string;
}
