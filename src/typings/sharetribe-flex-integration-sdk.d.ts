// https://stackoverflow.com/questions/21247278/about-d-ts-in-typescript
// https://stackoverflow.com/questions/41292559/could-not-find-a-declaration-file-for-module-module-name-path-to-module-nam

declare module 'sharetribe-flex-integration-sdk' {
  export function createInstance(
    config: ShareTribeSDKConfig,
  ): SharetribeIntegrationSdk;
  export const types: any;
  export type tokenStore = {
    memoryStore(): {
      getToken(): void;
      setToken(data: any): void;
      removeToken(): void;
    };
    fileStore: any;
  };
  export const util: any;

  type EventTypes =
    | 'listing/updated'
    | 'availabilityException/updated'
    | 'user/updated'
    | 'message/updated'
    | 'booking/updated'
    | 'stockAdjustment/updated'
    | 'review/updated'
    | 'stockReservation/updated'
    | 'listing/created'
    | 'availabilityException/created'
    | 'user/created'
    | 'message/created'
    | 'booking/created'
    | 'stockAdjustment/created'
    | 'review/created'
    | 'stockReservation/created'
    | 'listing/deleted'
    | 'availabilityException/deleted'
    | 'user/deleted'
    | 'message/deleted'
    | 'booking/deleted'
    | 'stockAdjustment/deleted'
    | 'review/deleted'
    | 'stockReservation/deleted'
    | 'transaction/updated'
    | 'transaction/created'
    | 'transaction/deleted'
    | 'transaction/initiated'
    | 'transaction/transitioned';

  type EventResponse = {
    createdAt: Date;
    sequenceId: number;
    eventType: EventTypes;
  };

  type UUID = {
    uuid: string;
  };

  type Event = {
    id: UUID;
  };

  type ShareTribeSDKConfig = {
    clientId: string;
    clientSecret?: string;
    tokenStore?: any;
    baseUrl?: string;
  };

  type EventsQueryParams = {
    startAfterSequenceId?: number;
    /**
     * ISO 8601 date time format
     */
    createdAtStart?: Date;
    resourceId?: UUID;
    eventTypes?: string;
    relatedResourceId?: UUID;
  };

  type ShareTribeEvents = {
    query(options?: EventsQueryParams): Promise<any>;
  };

  type SharetribeIntegrationSdk = {
    sdk: any;
    marketplace: {
      show(): Promise<any>;
    };
    events: ShareTribeEvents;
    listings: {
      show(): Promise<any>;
    };
  };
}

//  Generate event names
// const x = (a: string[]): string => {
//   return (
//     [
//       ...a.map((i) => `'${i}/updated'`),
//       ...a.map((i) => `'${i}/created'`),
//       ...a.map((i) => `'${i}/deleted'`),
//     ]?.join('|') ?? ''
//   );
// };

// console.log(
//   x([
//     'listing',
//     'availabilityException',
//     'user',
//     'message',
//     'booking',
//     'stockAdjustment',
//     'review',
//     'stockReservation',
//     'transaction'
//   ]),
// );
