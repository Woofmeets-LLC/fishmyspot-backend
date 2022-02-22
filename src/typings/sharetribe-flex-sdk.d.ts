// https://stackoverflow.com/questions/21247278/about-d-ts-in-typescript

type ShareTribeSDKConfig = {
  clientId: string;
  clientSecret?: string;
  tokenStore?: any;
};

type ExpressCookieStoreArgs = {
  clientId: string;
  req: Request;
  secure?: boolean;
};

class SharetribeSdk {
  exchangeToken(): Promise;
}

declare module 'sharetribe-flex-sdk' {
  export const tokenStore: {
    expressCookieStore(params: ExpressCookieStoreArgs): {
      getToken(): any;
    };
    memoryStore(): {
      setToken(params: any): any;
    };
  };
  export function createInstance(config: ShareTribeSDKConfig): SharetribeSdk;
}
