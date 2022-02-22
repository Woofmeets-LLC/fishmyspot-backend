export class GoogleFile implements Partial<Express.Multer.File> {
  fieldname?: string;
  originalname: string;
  encoding?: string;
  mimetype: string;
  size: number;
  filename: string;
  url: string;
  additional?: GoogleFileAdditionalProps;
}

export type GoogleFileAdditionalProps = {
  [key: string]: Pick<GoogleFile, 'size' | 'url' | 'mimetype'>;
};
