import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Max, Min } from 'class-validator';

export class RateResumeDto {
  @ApiProperty({
    example: 5,
    description: 'Rating score from 1 to 5 stars',
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @Min(1, { message: 'Rating must be at least 1 star' })
  @Max(5, { message: 'Rating cannot exceed 5 stars' })
  rating!: number;
}
