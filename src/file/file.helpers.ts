const commonMimeTypes = {
  'image/gif': true,
  'image/png': true,
  'application/pdf': true,
  'image/tiff': true,
  'text/csv': true,
  'text/css': true,
  'image/bmp': true,
  'image/webp': true,
  'video/webm': true,
  'text/html': true,
  'image/jpeg': true,
};

const imagesMimeTypes = {
  ...commonMimeTypes,
  'application/pdf': false,
  'video/webm': false,
  'text/csv': false,
  'text/css': false,
  'text/html': false,
};

export const isImage = (mimetype: string): boolean => {
  return imagesMimeTypes?.[mimetype] ?? false;
};

export function checkAllowedMimeType(
  mimeType: string,
  imagesOnly = false,
): boolean {
  const allowed = imagesOnly ? imagesMimeTypes : commonMimeTypes;

  const result = allowed?.[mimeType] ?? false;

  if (!result) console.error(`${mimeType} not allowed`);

  return result;
}
