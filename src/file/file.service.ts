import { Injectable } from '@nestjs/common';
import { GoogleFileUploadDto } from './dto/create-file.dto';
import { GoogleCloudStorageService } from './gcs/gcs.service';
import { v4 as uuid } from 'uuid';
import { FileOptimizerService } from './file-optimizer.service';
import { modifyUploadFileName } from './file-name.helpers';
import { PrismaService } from 'src/prisma/prisma.service';
import { FileEntity } from './entities/file.entity';

@Injectable()
export class FileService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly googleCloudFileService: GoogleCloudStorageService,
    private readonly optimizedFileService: FileOptimizerService,
  ) {}

  async create(file: GoogleFileUploadDto): Promise<FileEntity | null> {
    if (!file) return null;

    const uid = uuid();

    const modifiedFileName = modifyUploadFileName(file, uid);

    const optimizedFile = await this.optimizedFileService.createOptimizedImage(
      modifiedFileName,
    );

    const responseFile = await this.googleCloudFileService.upload(
      optimizedFile,
    );

    return this.prismaService.file.create({
      data: {
        filename: responseFile.filename,
        mimetype: responseFile.mimetype,
        url: responseFile.url,
        additional: responseFile.additional,
        size: responseFile.size,
      },
    });
  }

  async createMany(files: GoogleFileUploadDto[]): Promise<FileEntity[] | null> {
    if (!files) return null;

    const uid = uuid();
    const optimizedFiles = await Promise.all(
      files
        .map((file) => modifyUploadFileName(file, uid))
        .map((file) => this.optimizedFileService.createOptimizedImage(file)),
    );

    const uploadedFiles = await Promise.all(
      optimizedFiles.map((file) => this.googleCloudFileService.upload(file)),
    );

    return this.prismaService.$transaction([
      ...uploadedFiles
        .filter((file) => file !== null)
        .map((file) =>
          this.prismaService.file.create({
            data: {
              filename: file.filename,
              mimetype: file.mimetype,
              url: file.url,
              additional: file.additional,
              size: file.size,
            },
          }),
        ),
    ]);
  }
}
