import { Controller, Get, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import * as moment from 'moment';
import { SharetribeIntegrationService } from './sharetribe.integration.service';
import { SharetribeService } from './sharetribe.service';

@ApiTags('sharetribe')
@Controller('sharetribe')
export class SharetribeController {
  constructor(
    private readonly sharetribeService: SharetribeService,
    private readonly sharetribeIntegrationService: SharetribeIntegrationService,
  ) {}

  @Get()
  async find(@Request() req) {
    const token = this.sharetribeService.getTrastedSDK(req);
    token.then((res) => console.log(res));
    return 'Hello';
  }

  @Get('/event/order')
  async getOrderEvents() {
    // parse list of data
    const upcomingListingEvents =
      await this.sharetribeIntegrationService.queryEvents();
    // set notification items in queue
    console.log(upcomingListingEvents);

    return this.sharetribeIntegrationService.sendDelayedNotification(
      'notify me',
      new Date(moment(Date.now()).add(10, 'days').date()),
    );
  }
}
