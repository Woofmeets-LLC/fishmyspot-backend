import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { ToBoolean } from 'src/helpers/boolean-validator.transformer';
import { CreateFishDto } from './create-fish.dto';

export class UpdateFishDto extends PartialType(
  PickType(CreateFishDto, ['name', 'description', 'verified']),
) {
  @ApiProperty({
    required: false,
  })
  name?: string;
  @ApiProperty({
    required: false,
  })
  description?: string;
  @ApiProperty({
    required: false,
  })
  @ToBoolean()
  verified?: boolean;
}
