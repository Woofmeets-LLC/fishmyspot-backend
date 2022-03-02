import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaypalAuthResponse } from './dto/auth-response.dto';
import { CreateOnboardingDTO } from './dto/onboarding-create-dto';
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
  }
}
