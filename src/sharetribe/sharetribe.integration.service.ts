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
    console.log(clientId == clientSecret, clientSecret, clientId);
    return createInstance({
      clientId: clientId,
      clientSecret: clientSecret,
      baseUrl: 'https://flex-integ-api.sharetribe.com',
    });
  }

  async queryEvents() {
    console.log('THE ERROR IS');
    try {
      const sdk = this.#initializeIntegrationSDK();
      console.dir(sdk);
      return sdk.marketplace
        .show()
        .then((DATA) => console.log(DATA))
        .catch((e) => {
          console.log(e);
        });
    } catch (error) {
      return error;
    }
  }
}
