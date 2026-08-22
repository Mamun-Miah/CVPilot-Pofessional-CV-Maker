import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCommentStatusDto {
  @ApiProperty({
    example: 'hidden',
    description: 'Moderation status (approved / flagged / hidden)',
  })
  @IsNotEmpty()
  @IsString()
  status!: string;
}
