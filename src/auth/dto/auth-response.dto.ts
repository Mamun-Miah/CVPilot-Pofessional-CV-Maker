import { ApiProperty } from '@nestjs/swagger';

export class UserProfileDto {
  @ApiProperty({ example: 'uuid-1234-5678' })
  id: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'John Doe', nullable: true })
  name: string | null;

  @ApiProperty({ example: 'https://example.com/avatar.png', nullable: true })
  avatar: string | null;

  @ApiProperty({ example: '1234567890', nullable: true })
  googleId: string | null;

  @ApiProperty({ example: 'user' })
  role: string;

  @ApiProperty({ example: true })
  isVerified: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class AuthResponseDto {
  @ApiProperty({ type: UserProfileDto })
  user: UserProfileDto;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  access_token: string;
}

export class MessageResponseDto {
  @ApiProperty({ example: 'Operation completed successfully.' })
  message: string;
}

export class ForgotPasswordVerifyResponseDto {
  @ApiProperty({ example: 'OTP verified successfully.' })
  message: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  reset_token: string;
}
