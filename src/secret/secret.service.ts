import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StorageOptions } from '@google-cloud/storage';
import { join } from 'path';

@Injectable()
export class SecretService {
  constructor(private readonly configService: ConfigService) {}

  getSharetribeIntegrationKeys() {
    return {
      sharetribeIntegrationSecret: this.configService.get<string>(
        'FLEX_INTEGRATION_API_SECRET_KEY',
      ),
      sharetribeIntegrationClientId: this.configService.get<string>(
        'FLEX_MARKETPLACE_API_CLIENT_ID',
      ),
    };
  }

  getSharetribeMarketplaceKeys() {
    return {
      sharetribeMarketplaceClientId: this.configService.get<string>(
        'FLEX_MARKETPLACE_API_CLIENT_ID',
      ),
      sharetribeMarketplaceSecret: this.configService.get<string>(
        'FLEX_MARKETPLACE_API_SECRET_KEY',
      ),
    };
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
