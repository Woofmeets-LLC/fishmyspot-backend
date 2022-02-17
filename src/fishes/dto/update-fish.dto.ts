import { PartialType } from '@nestjs/mapped-types';
import { CreateFishDto } from './create-fish.dto';

export class UpdateFishDto extends PartialType(CreateFishDto) {}
