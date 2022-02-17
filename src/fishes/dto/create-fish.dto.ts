import { ApiProperty } from '@nestjs/swagger';
import { Fish } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';
import { GoogleFile } from 'src/file/dto/response-file.dto';

export class CreateFishDto implements Pick<Fish, 'name'> {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'Upload only images',
    type: 'array',
    items: { type: 'string', format: 'binary' },
  })
  // the files in the dto object is just for swagger and api body shape
  files: GoogleFile[];
}
