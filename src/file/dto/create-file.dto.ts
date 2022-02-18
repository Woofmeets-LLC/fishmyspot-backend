import { ApiProperty } from '@nestjs/swagger';
import { Readable } from 'stream';

export type BasicFileType = {
  buffer: Buffer;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  // this is what google uses to store the file
  filename: string;
  additional?: FileAdditionalKeyValueType;
};

export class GoogleFileUploadDto implements Express.Multer.File {
  stream: Readable;
  destination: string;
  path: string;
  buffer: Buffer;
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  // this is what google uses to store the file
  filename: string;
  additional?: FileAdditionalKeyValueType<GoogleFileUploadDto>;
}

type FileAdditionalKeyValueType<T extends BasicFileType = BasicFileType> = {
  [key: string]: Omit<T, 'additional'>;
};

export class CreateFileDTO {
  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  file: GoogleFileUploadDto;
}

export class CreateFilesDTO {
  @ApiProperty({
    type: 'string',
    isArray: true,
    format: 'binary',
  })
  files: GoogleFileUploadDto;
}
