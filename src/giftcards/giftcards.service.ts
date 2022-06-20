import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';
import { StripeService } from 'src/stripe/stripe.service';
import * as voucherify from 'voucher-code-generator';
import { ApplyPromoDTO, GetPromoDTO } from './dto';

@Injectable()
export class GiftcardsService {
  constructor(
    private readonly prismaService: PrismaService,
    private stripeService: StripeService,
  ) {}

  async getPromo(body: GetPromoDTO) {
    const paymentIntent = await this.stripeService.paymentIntents.retrieve(
      body.code,
    );
    if (paymentIntent?.status === 'succeeded') {
      const existingPromo = await this.prismaService.promoCode.findUnique({
        where: { paymentIntent: body.code },
      });
      if (!existingPromo) {
        const amount = paymentIntent.amount / 100;
        const vouchers = voucherify.generate({
          count: 1,
          pattern: `FMS${amount}-######`,
          charset: voucherify.charset('alphanumeric'),
        });
        try {
          const promocode = await this.prismaService.promoCode.create({
            data: {
              promo: vouchers[0],
              amount,
              paymentIntent: body.code,
              email: body.email,
            },
          });
          return promocode;
        } catch (e) {
          const refund = await this.stripeService.refunds.create({
            payment_intent: body.code,
          });
          if (e instanceof PrismaClientKnownRequestError) {
            if (e.code === 'P2002') {
              throw new ForbiddenException(
                'A promo code generation failed. Please try again.',
              );
            }
          }

          throw e;
        }
      } else {
        throw new ForbiddenException('Something went wrong. Please try again.');
      }
    } else {
      throw new ForbiddenException('Payment is not completed');
    }
  }

  async verifyPromo(code: string) {
    const existingPromo = await this.prismaService.promoCode.findUnique({
      where: { promo: code },
    });
    if (existingPromo) {
      return existingPromo;
    } else {
      throw new ForbiddenException('Something went wrong. Please try again.');
    }
  }

  async applyPromo(body: ApplyPromoDTO) {
    const {
      promo,
      anglerId,
      transactionId,
      usedAmount,
      paymentIntent,
      pondId,
      pondOwnerId,
    } = body;

    try {
      const promoEntry = await this.prismaService.promoCode.findUnique({
        where: { promo },
      });
      if (promoEntry?.amount >= usedAmount) {
        const entry = await this.prismaService.promoCode.update({
          where: { promo },
          data: {
            amount: {
              decrement: usedAmount,
            },
            PromoUsage: {
              create: {
                anglerId,
                pondOwnerId,
                transactionId,
                paymentIntent,
                usedAmount,
                pondId,
              },
            },
          },
          // select: {
          //   amount: true,
          //   email: true,
          //   PromoUsage: {
          //     select: {
          //       usedAmount: true,
          //     },
          //   },
          // },
        });
        return entry;
      } else {
        throw new ForbiddenException('Promo code or used amount is not valid');
      }
    } catch (err) {
      console.log({ err });
      throw new ForbiddenException('Something went wrong');
    }

    return {};
  }
}
