import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StorageOptions } from '@google-cloud/storage';
import { join } from 'path';

@Injectable()
export class SecretService {
  constructor(private readonly configService: ConfigService) {}

  getSharetribeIntegrationKeys() {
    return { port: this.configService.get<number>('PORT') };
  }

  getGoogleCloudSecretOptions(): StorageOptions {
    const getStorageServiceKeyDir = this.configService.get<string>(
      'GCS_SERVICE_KEY_PATH',
    );

    const keyFile = join(__dirname, '../../', getStorageServiceKeyDir);

    const projectId = this.configService.get<string>('GCS_PROJECT_ID');
    return {
      projectId,
      keyFile,
      keyFilename: keyFile,
    };
  }

  getCloudBucketName() {
    return this.configService.get<string>('GCS_BUCKET_NAME');
  }
}
