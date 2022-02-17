import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { checkAllowedMimeType } from './file.helpers';

const fileDecorator = (
  path: string,
  imageOnly = false,
  multipleFiles = false,
) =>
  applyDecorators(
    UseInterceptors(
      multipleFiles
        ? FilesInterceptor(path, 10, {
            fileFilter: function (req, files, cb) {
              cb(null, checkAllowedMimeType(files.mimetype, imageOnly));
            },
          })
        : FileInterceptor(path, {
            fileFilter: function (req, files, cb) {
              cb(null, checkAllowedMimeType(files.mimetype, imageOnly));
            },
          }),
    ),
  );

export function SingleFileUpload(path: string, imageOnly = false) {
  return fileDecorator(path, imageOnly, false);
}

export const MultiFileUpload = (path: string, imageOnly = false) => {
  return fileDecorator(path, imageOnly, true);
};
