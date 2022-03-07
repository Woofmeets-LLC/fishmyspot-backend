import { Controller, Get, Request } from '@nestjs/common';
import { SharetribeIntegrationService } from './sharetribe.integration.service';
import { SharetribeService } from './sharetribe.service';

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
    return this.sharetribeIntegrationService.queryEvents();
  }
}
