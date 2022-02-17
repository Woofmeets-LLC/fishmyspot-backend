import { Injectable } from '@nestjs/common';
import { GoogleFileUploadDto } from './dto/create-file.dto';
import { modifyUploadFileName } from './file.helpers';
import { GoogleCloudStorageService } from './gcs/gcs.service';
import { v4 as uuid } from 'uuid';
import { GoogleFile } from './dto/response-file.dto';

@Injectable()
export class FileService {
  constructor(
    private readonly googleCloudFileService: GoogleCloudStorageService,
  ) {}

  async create(file: GoogleFileUploadDto): Promise<GoogleFile | null> {
    if (!file) return null;
    const uid = uuid();
    return this.googleCloudFileService.upload(modifyUploadFileName(file, uid));
  }

  async createMany(files: GoogleFileUploadDto[]): Promise<GoogleFile[] | null> {
    if (!files) return null;

    const uid = uuid();
    return Promise.all(
      files
        .map((file) =>
          this.googleCloudFileService.upload(modifyUploadFileName(file, uid)),
        )
        .filter((file) => file !== null),
    );
  }
}
