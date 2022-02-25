// https://stackoverflow.com/questions/21247278/about-d-ts-in-typescript

type ShareTribeSDKConfig = {
  clientId: string;
  clientSecret?: string;
  tokenStore?: any;
};

class SharetribeIntegrationSdk {}

declare module 'sharetribe-flex-integration-sdk' {
  export function createInstance(
    config: ShareTribeSDKConfig,
  ): SharetribeIntegrationSdk;
}
