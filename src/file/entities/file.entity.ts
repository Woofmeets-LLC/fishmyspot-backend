import { ApiProperty } from '@nestjs/swagger';
import { File, Prisma } from '@prisma/client';

export class FileEntity implements Partial<File> {
  @ApiProperty()
  id: number;
  @ApiProperty()
  filename: string;
  @ApiProperty()
  mimetype: string;
  @ApiProperty()
  size: number;
  @ApiProperty()
  url: string;
  @ApiProperty()
  fishId?: number;
}
