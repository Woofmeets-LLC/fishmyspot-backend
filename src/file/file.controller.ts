import {
  Controller,
  Post,
  UploadedFiles,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { FileService } from './file.service';
import { MultiFileUpload, SingleFileUpload } from './custom-file.interceptor';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CreateFileDTO, CreateFilesDTO } from './dto/create-file.dto';

@ApiTags('Files')
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('/multi-files')
  @MultiFileUpload('files')
  @ApiBody({
    type: CreateFilesDTO,
  })
  @ApiConsumes('multipart/form-data')
  uploadMultipleFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    return this.fileService.createMany(files);
  }

  @Post('/single-file')
  @SingleFileUpload('file')
  @ApiConsumes('multipart/form-data')
  uploadSingleFile(
    @Body() body: CreateFileDTO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.fileService.create(file);
  }
}
