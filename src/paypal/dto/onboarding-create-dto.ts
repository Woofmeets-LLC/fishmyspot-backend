import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateOnboardingDTO {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  tracking_id: string;
}
