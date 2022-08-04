import {
  Body,
  Controller,
  Get,
  Headers,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Request, Response } from 'express';
import {
  ApplyPromoDTO,
  ApproveTransactionDTO,
  GetDiscountDTO,
  GetPromoDTO,
  InvalidateDiscountsDTO,
} from './dto';
import { GiftcardsService } from './giftcards.service';
@Controller('giftcards')
export class GiftcardsController {
  constructor(private readonly giftCardService: GiftcardsService) {}

  @Post('promo')
  async getPromo(@Body() body: GetPromoDTO) {
    return this.giftCardService.getPromo(body);
  }

  @Post('discount')
  async getDiscount(@Body() body: GetDiscountDTO) {
    return this.giftCardService.getDiscount(body);
  }

  @Post('discount/invalidate')
  async invalidateCoupons(@Body() body: InvalidateDiscountsDTO) {
    return this.giftCardService.invalidateCoupons(body);
  }

  // @UseGuards(JwtAuthGuard)
  @Post('strapi')
  async handleStarpiWebhook(@Req() req: Request, @Res() res: Response) {
    const eventType = req.body.event;
    switch (eventType) {
      case 'entry.update':
        return this.giftCardService.updateDiscount(
          req.body.entry.amount,
          req.body.entry.valid,
          req.body.entry.coupon,
        );
      case 'entry.delete':
        return this.giftCardService.updateDiscount(
          req.body.entry.amount,
          false,
          req.body.entry.coupon,
        );
      default:
        console.log(`Unhandled event type ${eventType} in handleStarpiWebhook`);
    }
    res.status(HttpStatus.OK).send();
  }

  @Get(':code')
  async verifyPromo(@Param('code') code: string) {
    return this.giftCardService.verifyPromo(code);
  }

  @Post('apply')
  async applyPromo(@Body() body: ApplyPromoDTO) {
    return this.giftCardService.applyPromo(body);
  }

  @Post('approvetransaction')
  async approveTransaction(@Body() body: ApproveTransactionDTO) {
    return this.giftCardService.approveTransaction(body);
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
