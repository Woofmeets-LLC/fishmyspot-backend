import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import * as sharetribe from 'sharetribe-flex-integration-sdk';
import { SecretService } from 'src/secret/secret.service';
import { json } from 'stream/consumers';

@Injectable()
export class SharetribeIntegrationService {
  constructor(private readonly secretService: SecretService) {}

  #initializeIntegrationSDK() {
    const {
      sharetribeIntegrationSecret: clientSecret,
      sharetribeIntegrationClientId: clientId,
    } = this.secretService.getSharetribeIntegrationKeys();

    return sharetribe.createInstance({
      clientId: clientId,
      clientSecret: clientSecret,
    });
  }

  async queryEvents() {
    try {
      // https://www.sharetribe.com/api-reference/integration.html#bookings
      // last processed booking -> retrieve from db
      return this.#initializeIntegrationSDK()
        .events.query({
          eventTypes: 'user/created',
          // add the retrieved event id from db
          // startAfterSequenceId: '',
        })
        .then((resp) => JSON.stringify(resp));
    } catch (error) {
      return error;
    }
  }

  async sendDelayedNotification(message: string, notifyAt?: Date) {
    // save process id in db
    if (!notifyAt) {
      // send notification immediately
      return `Notified Immediately ${message}`;
    }
    // notify at X-certain time (some other time)
    //    store in database unique event id, with date
    //    with notification false
    //    store queued notification in database

    return `Notification Queued: ${message} will be notified at ${moment(
      notifyAt,
    ).format('LLLL')}`;
  }
}
