import { Injectable } from '@nestjs/common';
import { createInstance } from 'sharetribe-flex-integration-sdk';
import { SecretService } from 'src/secret/secret.service';

@Injectable()
export class SharetribeIntegrationService {
  constructor(private readonly secretService: SecretService) {}

  #initializeIntegrationSDK() {
    const {
      sharetribeIntegrationSecret: clientSecret,
      sharetribeIntegrationClientId: clientId,
    } = this.secretService.getSharetribeIntegrationKeys();

    return createInstance({
      clientId,
      clientSecret,
    });
  }

  async queryEvents() {
    console.log('THE ERROR IS');
    try {
      const sdk = this.#initializeIntegrationSDK();
      return sdk.events.query().catch((e) => {
        console.log(e);
      });
    } catch (error) {
      return error;
    }
  }
}
