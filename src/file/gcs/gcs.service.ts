import { Injectable } from '@nestjs/common';
import { Bucket } from '@google-cloud/storage';
import { SecretService } from 'src/secret/secret.service';
import { getBucketFromStorage, getStorageInstance } from './gcs.helpers';
import { GoogleFile } from '../dto/response-file.dto';
import { GoogleFileUploadDto } from '../dto/create-file.dto';
import { format } from 'util';

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

  async upload(file: GoogleFileUploadDto): Promise<GoogleFile | null> {
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
}