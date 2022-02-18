import { v4 } from 'uuid';
import { GoogleFileUploadDto } from './dto/create-file.dto';
import { IMAGE_MIME_TYPE_EXTENSION } from './mime.types';

export const changeFileExtension = (
  name?: string,
  ext = IMAGE_MIME_TYPE_EXTENSION.WEBP,
) => {
  if (!name) return name;
  const lastDot = name.lastIndexOf('.');
  return `${name.substring(0, lastDot)}.${ext}`;
};

export function modifyUploadFileName(
  file: GoogleFileUploadDto,
  uuid: string,
): GoogleFileUploadDto {
  const fieldname = file.fieldname ? `${file.fieldname}/` : '';
  const short_uid = v4();
  return {
    ...file,
    filename: `${fieldname}${uuid}/${short_uid}-${file.originalname}`,
  };
}

/**
 *
 * @param name original filename
 * @param key uniquie property to add to `name`
 * @returns name-key.extension
 */
export const addMoreInfoToFileName = (name: string, key: string) => {
  const lastDot = name.lastIndexOf('.');
  return `${name.substring(0, lastDot)}-${key}${name.substring(lastDot)}`;
};
