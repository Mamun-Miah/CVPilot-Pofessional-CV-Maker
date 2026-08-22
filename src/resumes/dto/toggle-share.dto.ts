import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class ToggleShareDto {
  @ApiPropertyOptional({
    example: true,
    description:
      'Turn public link sharing ON (true) or OFF (false). If omitted, toggles current state.',
  })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
