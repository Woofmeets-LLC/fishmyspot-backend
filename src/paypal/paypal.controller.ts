<<<<<<< HEAD
import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaypalAuthResponse } from './dto/auth-response.dto';
import { CreateOnboardingDTO } from './dto/onboarding-create-dto';
=======
import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaypalAuthResponse } from './dto/auth-response.dto';
>>>>>>> 3a109d55ac403d32303941909d2eb4e509c66717
import { GenerateOnBoardingSignupUrl } from './dto/onboarding-response.dto';
import { PaypalService } from './paypal.service';

@ApiTags('paypal')
@Controller('paypal')
export class PaypalController {
  constructor(private readonly paypalService: PaypalService) {}

  @Get('/access-token')
  @ApiResponse({
    type: PaypalAuthResponse,
  })
  async getAccessToken(): Promise<PaypalAuthResponse> {
    return this.paypalService.getCredentials();
  }

<<<<<<< HEAD
  @Post('/Webhook')
  async handlePaypalWebhook(@Body() body) {
    if (body.event_type === 'MERCHANT.ONBOARDING.COMPLETED') {
      const {
        resource: { merchant_id, partner_client_id },
      } = body;

      console.log({ merchant_id, partner_client_id });
    }
    return 'working';
  }

  @Post('/generate-signup-link')
  @ApiResponse({
    type: GenerateOnBoardingSignupUrl,
  })
  @ApiBody({
    type: CreateOnboardingDTO,
    description:
      'Send a tracker id, this can be used to track the status of the merchant',
    required: false,
  })
  async get(
    @Body() body: CreateOnboardingDTO,
  ): Promise<GenerateOnBoardingSignupUrl> {
    return this.paypalService.generateOnboardingUrl(body);
=======
  @Get('/generate-signup-link')
  @ApiResponse({
    type: GenerateOnBoardingSignupUrl,
  })
  async get(): Promise<GenerateOnBoardingSignupUrl> {
    return this.paypalService.generateOnboardingUrl();
>>>>>>> 3a109d55ac403d32303941909d2eb4e509c66717
  }
}
