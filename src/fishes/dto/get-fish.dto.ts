import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { FileEntity } from 'src/file/entities/file.entity';

type FishWithImages = Omit<
  Prisma.FishGetPayload<{
    include: {
      image: true;
    };
  }>,
  'deletedAt' | 'image'
>;

export class GetFishDto implements FishWithImages {
  @ApiProperty()
  fileId: number;
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty({
    type: () => FileEntity,
  })
  image: FileEntity;
  @ApiProperty()
  additional: Prisma.JsonValue;
}
