import { Injectable } from '@nestjs/common';
import { BasicFileType } from './dto/create-file.dto';
import * as sharp from 'sharp';
import { isImage } from './file.helpers';
import { changeFileExtension } from './file-name.helpers';
import { IMAGE_MIME_TYPE_EXTENSION, MIME_TYPE_NAME } from './mime.types';

@Injectable()
export class FileOptimizerService {
  async #optimizeImageToWebP<T extends BasicFileType>(
    file: T,
    quality: number,
    width: number,
  ): Promise<T> {
    // Resize image using sharp
    const buffer = await sharp(file.buffer)
      .resize(width)
      .webp({
        quality,
      })
      .toBuffer();

    const originalname = changeFileExtension(
      file?.originalname,
      IMAGE_MIME_TYPE_EXTENSION.WEBP,
    );

    const filename = changeFileExtension(
      file?.filename ?? file?.originalname,
      IMAGE_MIME_TYPE_EXTENSION.WEBP,
    );

    return {
      ...file,
      originalname,
      filename,
      mimetype: MIME_TYPE_NAME.WEBP,
      size: Buffer.byteLength(buffer),
      buffer: buffer,
    };
  }

  /**
   *
   * @param file
   * @description - Optimizes images based [on this specifications](https://www.photoreview.com.au/tips/outputting/image-size-and-resolution-requirements/)
   * @returns
   */
  async createOptimizedImage<T extends BasicFileType>(file: T): Promise<T> {
    if (!isImage(file.mimetype) || file.mimetype === 'image/webp') {
      return file;
    }

    const [sm, md, lg, xl] = await Promise.all([
      this.#optimizeImageToWebP(file, 65, 320),
      this.#optimizeImageToWebP(file, 65, 720),
      this.#optimizeImageToWebP(file, 65, 1024),
      this.#optimizeImageToWebP(file, 70, 1920),
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
