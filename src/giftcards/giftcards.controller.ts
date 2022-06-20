import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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
}
