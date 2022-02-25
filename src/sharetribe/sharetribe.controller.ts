import { Controller, Get, Request } from '@nestjs/common';
import { SharetribeService } from './sharetribe.service';

@Controller('sharetribe')
export class SharetribeController {
  constructor(private readonly sharetribeService: SharetribeService) {}

  @Get()
  async find(@Request() req) {
    const token = this.sharetribeService.getTrastedSDK(req);
    token.then((res) => console.log(res));
    return 'Hello';
  }
}
