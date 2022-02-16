import { Injectable } from '@nestjs/common';
import { GoogleFileUploadDto } from './dto/create-file.dto';
import { modifyUploadFileName } from './file.helpers';
import { GoogleCloudStorageService } from './gcs/gcs.service';
import { v4 as uuid } from 'uuid';

@Injectable()
export class FileService {
  constructor(
    private readonly googleCloudFileService: GoogleCloudStorageService,
  ) {}

  async create(file: GoogleFileUploadDto) {
    const uid = uuid();
    return this.googleCloudFileService.upload(modifyUploadFileName(file, uid));
  }

  async createMany(files: GoogleFileUploadDto[]) {
    const uid = uuid();
    return Promise.all(
      files.map((file) =>
        this.googleCloudFileService.upload(modifyUploadFileName(file, uid)),
      ),
    );
  }
}
