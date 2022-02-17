import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { FileEntity } from 'src/file/entities/file.entity';

type FishWithImages = Omit<
  Prisma.FishGetPayload<{
    include: {
      images: true;
    };
  }>,
  'deletedAt' | 'images'
>;

export class GetFishDto implements FishWithImages {
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
    isArray: true,
    type: () => [FileEntity],
  })
  images: FileEntity[];
}
