import { Controller, Get } from '@nestjs/common';
import { PaypalService } from './paypal.service';

@Controller('paypal')
export class PaypalController {
  constructor(private readonly paypalService: PaypalService) {}

  @Get('/access-token')
  async getAccessToken() {
    return this.paypalService.getCredentials();
  }

  @Get('/generate-signup-link')
  async get() {
    return this.paypalService.generateOnboardingUrl();
  }
}
