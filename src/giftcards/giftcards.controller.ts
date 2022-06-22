import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { ApplyPromoDTO, GetPromoDTO } from './dto';
import { GiftcardsService } from './giftcards.service';
@Controller('giftcards')
export class GiftcardsController {
  constructor(private readonly giftCardService: GiftcardsService) {}

  @Post('promo')
  async getPromo(@Body() body: GetPromoDTO) {
    return this.giftCardService.getPromo(body);
  }

  @Get(':code')
  async verifyPromo(@Param('code') code: string) {
    return this.giftCardService.verifyPromo(code);
  }

  @Post('apply')
  async applyPromo(@Body() body: ApplyPromoDTO) {
    return this.giftCardService.applyPromo(body);
  }

  @ApiOperation({
    summary: 'Only Stripe will use this api for sending their webhook events!',
  })
  @Post('webhook')
  async handleWebhook(
    @Headers('stripe-signature') signature,
    @Req() request: any,
    @Res() response: Response,
  ) {
    return this.giftCardService.stripeWebhook(
      signature,
      request.rawBody,
      response,
    );
  }
}
