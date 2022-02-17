import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { GoogleCloudStorageService } from './gcs/gcs.service';
import { SecretService } from 'src/secret/secret.service';
import { SecretModule } from 'src/secret/secret.module';
import { FileOptimizerService } from './file-optimizer.service';

@Module({
  imports: [SecretModule],
  controllers: [FileController],
  providers: [
    FileService,
    GoogleCloudStorageService,
    SecretService,
    FileOptimizerService,
  ],
  exports: [FileService, SecretService, FileOptimizerService],
})
export class FileModule {}
