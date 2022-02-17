import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFishDto } from './dto/create-fish.dto';
import { UpdateFishDto } from './dto/update-fish.dto';

@Injectable()
export class FishesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createFishDto: CreateFishDto) {
    const { name, description, files } = createFishDto;

    return this.prismaService.fish.create({
      data: {
        name,
        description,
        ...(files && {
          images: {
            createMany: {
              data: files?.map((value) => {
                return {
                  filename: value.originalname,
                  url: value.url,
                  size: value.size,
                  mimetype: value.mimetype,
                };
              }),
            },
          },
        }),
      },
      include: {
        images: true,
      },
    });
  }

  findAll() {
    return this.prismaService.fish.findMany({
      where: {
        deletedAt: {
          equals: null,
        },
      },
      include: {
        images: true,
      },
    });
  }

  findOne(id: number) {
    return this.prismaService.fish.findFirst({
      where: {
        id,
        deletedAt: {
          equals: null,
        },
      },
      include: {
        images: true,
      },
    });
  }

  update(id: number, updateFishDto: UpdateFishDto) {
    return `This action updates a #${id} fish`;
  }

  async remove(id: number) {
    return this.prismaService.fish.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(Date.now()),
      },
    });
  }
}
