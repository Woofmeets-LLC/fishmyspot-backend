import { Controller, Get } from '@nestjs/common';
import { createInstance } from 'sharetribe-flex-integration-sdk';

@Controller('sharetribe')
export class SharetribeController {
  @Get()
  async find() {
    console.log(
      createInstance({
        clientId: 'asasasa',
      }),
    );
    return 'Hello';
  }
}
