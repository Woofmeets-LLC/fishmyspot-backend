import { Injectable } from '@nestjs/common';
import { GoogleFileUploadDto } from './dto/create-file.dto';
import * as sharp from 'sharp';
import { isImage } from './file.helpers';

const changeExtension = (name?: string, ext = 'webp') => {
  if (!name) return name;
  const lastDot = name.lastIndexOf('.');
  return `${name.substring(0, lastDot)}.${ext}`;
};

@Injectable()
export class FileOptimizerService {
  async #optimizeImageToWebP(
    file: GoogleFileUploadDto,
    quality: number,
    width: number,
  ): Promise<GoogleFileUploadDto> {
    const buffer = await sharp(file.buffer)
      .resize(width)
      .webp({
        quality,
      })
      .resize()
      .toBuffer();
    return {
      ...file,
      originalname: changeExtension(file?.originalname, 'webp'),
      filename: changeExtension(file?.filename ?? file?.originalname, 'webp'),
      mimetype: 'image/webp',
      size: Buffer.byteLength(buffer),
      buffer: buffer,
    };
  }

  async optimizeImage(file: GoogleFileUploadDto): Promise<GoogleFileUploadDto> {
    if (!isImage(file.mimetype) || file.mimetype === 'image/webp') {
      return file;
    }

    // https://www.photoreview.com.au/tips/outputting/image-size-and-resolution-requirements/

    const [sm, md, lg, xl] = await Promise.all([
      this.#optimizeImageToWebP(file, 90, 320),
      this.#optimizeImageToWebP(file, 80, 720),
      this.#optimizeImageToWebP(file, 80, 1024),
      this.#optimizeImageToWebP(file, 80, 1920),
    ]);

    return {
      ...file,
      additional: {
        sm,
        md,
        lg,
        xl,
      },
    };
  }
}
