import { PartialType } from '@nestjs/mapped-types';
import { PickType } from '@nestjs/swagger';
import { CreateFishDto } from './create-fish.dto';

export class UpdateFishDto extends PartialType(
  PickType(CreateFishDto, ['name', 'description']),
) {}
