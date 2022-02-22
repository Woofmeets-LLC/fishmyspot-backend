import { Injectable } from '@nestjs/common';
import { Bucket } from '@google-cloud/storage';
import { SecretService } from 'src/secret/secret.service';
import { getBucketFromStorage, getStorageInstance } from './gcs.helpers';
import {
  GoogleFile,
  GoogleFileAdditionalProps,
} from '../dto/response-file.dto';
import { BasicFileType, GoogleFileUploadDto } from '../dto/create-file.dto';
import { format } from 'util';
import { addMoreInfoToFileName } from '../file-name.helpers';

// https://medium.com/@olamilekan001/image-upload-with-google-cloud-storage-and-node-js-a1cf9baa1876

@Injectable()
export class GoogleCloudStorageService {
  private readonly bucket: Bucket;

  constructor(private readonly secretService: SecretService) {
    const storage = getStorageInstance(
      this.secretService.getGoogleCloudSecretOptions(),
    );
    this.bucket = getBucketFromStorage(
      storage,
      this.secretService.getCloudBucketName(),
    );
  }

  async #googleUpload(file: GoogleFileUploadDto): Promise<GoogleFile | null> {
    return new Promise((resolve, reject) => {
      const { originalname, buffer, filename } = file;
      const blob = this.bucket.file(filename);

      const stream = blob.createWriteStream({
        metadata: {
          mimetype: file.mimetype,
          size: file.size,
          originalname: file.filename,
        },
        resumable: false,
      });

      stream
        .on('finish', () => {
          resolve({
            url: format(
              `https://storage.googleapis.com/${this.bucket.name}/${blob.name}`,
            ),
            mimetype: file.mimetype,
            originalname,
            size: file.size,
            fieldname: file.fieldname,
            filename: file.filename,
          });
        })
        .on('error', (err) => {
          console.log(`Error uploading file ${file.originalname}`);
          console.log(err);
          reject(null);
        })
        .end(buffer);
    });
  }

  async upload(file: GoogleFileUploadDto): Promise<GoogleFile | null> {
    // no additional files to upload, then simply upload the original file
    if (!file?.additional) return this.#googleUpload(file);

    const parent = await this.#googleUpload(file);

    return this.#uploadOptimizedFilesToGoogle(parent, file);
  }

  async #uploadOptimizedFilesToGoogle(
    parent: GoogleFile,
    file: GoogleFileUploadDto,
  ): Promise<GoogleFile | null> {
    const optimizations = await Promise.all([
      ...Object.entries(file.additional).map(([key, value]) =>
        this.#googleUpload({
          ...value,
          filename: addMoreInfoToFileName(value.filename, key),
        }),
      ),
    ]);

    const keys = Object.keys(file.additional);

    const metadataCb = (item: GoogleFile, index: number) => {
      const { url, size, mimetype } = item;
      return {
        [keys.at(index)]: {
          url,
          size,
          mimetype,
        },
      };
    };
    const optimizedmetadata: GoogleFileAdditionalProps[] =
      optimizations.map(metadataCb);

    const additional: GoogleFileAdditionalProps = Object.assign(
      {},
      ...optimizedmetadata,
    );

    return { ...parent, additional };
  }
}
