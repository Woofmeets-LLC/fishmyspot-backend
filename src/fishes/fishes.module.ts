import { Module } from '@nestjs/common';
import { FishesService } from './fishes.service';
import { FishesController } from './fishes.controller';
import { FileModule } from 'src/file/file.module';
import { FileService } from 'src/file/file.service';
import { GoogleCloudStorageService } from 'src/file/gcs/gcs.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [FileModule, PrismaModule],
  controllers: [FishesController],
  providers: [
    FishesService,
    PrismaService,
    FileService,
    GoogleCloudStorageService,
  ],
  exports: [FileService, GoogleCloudStorageService, PrismaService],
})
export class FishesModule {}
