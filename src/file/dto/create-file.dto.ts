import { Readable } from 'stream';

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
  filename: string;
}
