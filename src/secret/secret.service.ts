import { StorageOptions } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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

  getPayPalSecrets() {
    const url = this.configService.get<string>('PAYPAL_URL');

    return {
      clientId: this.configService.get<string>('PAYPAL_CLIENT_ID'),
      secret: this.configService.get<string>('PAYPAL_SECRET'),
      url,
    };
  }

  getPayPalOnboardingRedirectUrl(): string {
    return this.configService.get<string>('PAYPAL_REDIRECT_URL');
  }

  getCloudBucketName() {
    return this.configService.get<string>('GCS_BUCKET_NAME');
  }
}
