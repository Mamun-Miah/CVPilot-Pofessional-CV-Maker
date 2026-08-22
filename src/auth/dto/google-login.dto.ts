import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleLoginDto {
  @ApiProperty({
    example: 'eyJhbGciOiJSUzI1NiIs...',
    description: 'Google ID token obtained from Google Sign-In on client side',
  })
  @IsString()
  @IsNotEmpty()
  idToken: string;
}
