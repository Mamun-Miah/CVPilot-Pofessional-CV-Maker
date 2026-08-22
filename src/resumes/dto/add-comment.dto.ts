import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class AddCommentDto {
  @ApiProperty({
    example:
      'Great structure and clean modern layout! Highlights experience very clearly.',
    description: 'Comment body text',
  })
  @IsNotEmpty({ message: 'Comment content cannot be empty' })
  @IsString()
  @MaxLength(1000, { message: 'Comment cannot exceed 1000 characters' })
  content!: string;
}
