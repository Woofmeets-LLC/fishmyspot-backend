import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { GoogleCloudStorageService } from './gcs/gcs.service';
import { SecretService } from 'src/secret/secret.service';
import { SecretModule } from 'src/secret/secret.module';
import { FileOptimizerService } from './file-optimizer.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [SecretModule, PrismaModule],
  controllers: [FileController],
  providers: [
    FileService,
    GoogleCloudStorageService,
    PrismaService,
    SecretService,
    FileOptimizerService,
  ],
  exports: [FileService, PrismaService, SecretService, FileOptimizerService],
})
export class FileModule {}
