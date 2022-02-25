import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createInstance, tokenStore } from 'sharetribe-flex-sdk';

@Injectable()
export class SharetribeService {
  private flexClientId: string;
  private flexSecretKey: string;
  private usingSSL: boolean;

  constructor(private readonly configService: ConfigService) {
    this.flexClientId = configService.get('FLEX_MARKETPLACE_API_CLIENT_ID');
    this.flexSecretKey = configService.get('FLEX_MARKETPLACE_API_SECRET_KEY');
  }

  getSDK(): SharetribeSdk {
    return createInstance({
      clientId: this.flexClientId,
    });
  }

  private getUserToken(req) {
    const cookieTokenStore = tokenStore.expressCookieStore({
      clientId: this.flexClientId,
      req,
    });
    return cookieTokenStore.getToken();
  }

  private memoryStore(token) {
    const store = tokenStore.memoryStore();
    store.setToken(token);
    return store;
  }

  getTrastedSDK(req): Promise<SharetribeSdk> {
    const userToken = this.getUserToken(req);

    // Initiate an SDK instance for token exchange
    const sdk = createInstance({
      clientId: this.flexClientId,
      clientSecret: this.flexSecretKey,
      tokenStore: this.memoryStore(userToken),
    });

    // Perform a token exchange
    return sdk.exchangeToken().then((response) => {
      // Setup a trusted sdk with the token we got from the exchange:
      const trustedToken = response.data;

      return createInstance({
        // We don't need CLIENT_SECRET here anymore
        clientId: this.flexClientId,

        // Important! Do not use a cookieTokenStore here but a memoryStore
        // instead so that we don't leak the token back to browser client.
        tokenStore: this.memoryStore(trustedToken),
      });
    });
  }
}
