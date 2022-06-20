import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
@Injectable()
export class StripeService extends Stripe {
  constructor(configService: ConfigService) {
    super(configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2020-08-27',
    });
  }
}
