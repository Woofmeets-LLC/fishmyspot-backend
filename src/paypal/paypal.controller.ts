import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaypalAuthResponse } from './dto/auth-response.dto';
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

  @Get('/generate-signup-link')
  @ApiResponse({
    type: GenerateOnBoardingSignupUrl,
  })
  async get(): Promise<GenerateOnBoardingSignupUrl> {
    return this.paypalService.generateOnboardingUrl();
  }
}
