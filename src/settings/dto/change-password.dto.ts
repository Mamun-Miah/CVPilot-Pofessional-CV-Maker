import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    example: 'CurrentPassword123!',
    description: 'Current password',
  })
  @IsNotEmpty()
  @IsString()
  currentPassword!: string;

  @ApiProperty({
    example: 'NewSecretPassword123!',
    description: 'New password',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  newPassword!: string;
}
