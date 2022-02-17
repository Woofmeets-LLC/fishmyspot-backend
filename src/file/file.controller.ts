import { Controller, Post, UploadedFiles, UploadedFile } from '@nestjs/common';
import { FileService } from './file.service';
import { MultiFileUpload, SingleFileUpload } from './custom-file.interceptor';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('/multi-files')
  @MultiFileUpload('files')
  uploadMultipleFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    return this.fileService.createMany(files);
  }

  @Post('/single-file')
  @SingleFileUpload('file')
  uploadSingleFile(@UploadedFile() file: Express.Multer.File) {
    return this.fileService.create(file);
  }
}
