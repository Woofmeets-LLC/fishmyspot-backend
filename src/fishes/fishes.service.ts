import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFishDto } from './dto/create-fish.dto';
import { UpdateFishDto } from './dto/update-fish.dto';

@Injectable()
export class FishesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createFishDto: CreateFishDto) {
    const { name, description, file } = createFishDto;

    return this.prismaService.fish.create({
      data: {
        name,
        description,
        image: {
          connect: {
            id: file.id,
          },
        },
      },
      include: {
        image: true,
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
        image: true,
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
        image: true,
      },
    });
  }

  update(id: number, updateFishDto: UpdateFishDto) {
    return this.prismaService.fish.update({
      where: { id },
      data: {
        ...updateFishDto,
      },
    });
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
