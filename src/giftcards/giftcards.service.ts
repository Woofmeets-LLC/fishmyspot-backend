import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import axios from 'axios';
import { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { StripeService } from 'src/stripe/stripe.service';
import * as voucherify from 'voucher-code-generator';
import { ApplyPromoDTO, ApproveTransactionDTO, GetPromoDTO } from './dto';

@Injectable()
export class GiftcardsService {
  constructor(
    private readonly prismaService: PrismaService,
    private stripeService: StripeService,
    private readonly configService: ConfigService,
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

  async approveTransaction(body: ApproveTransactionDTO) {
    const { transactionId } = body;

    try {
      const result = await this.prismaService.promoUsage.update({
        where: {
          transactionId,
        },
        data: {
          isSuccess: true,
        },
      });
      delete result.paymentIntent;
      return result;
    } catch (err) {
      throw new ForbiddenException('Something went wrong. Please try again.');
    }
  }

  @Cron('0 */5 * * * *')
  async handleCron() {
    const promoUsage = await this.prismaService.promoUsage.findMany({
      where: {
        isSuccess: false,
        createdAt: {
          lte: new Date(Date.now() - 10 * 60 * 1000),
        },
      },
    });

    console.log('cron executed : ', new Date().toISOString());
    promoUsage.forEach(async (item) => {
      const paymentIntent = await this.stripeService.paymentIntents.retrieve(
        item.paymentIntent,
      );
      if (paymentIntent.status === 'canceled') {
        const promoUsageEntry = await this.prismaService.promoUsage.findUnique({
          where: {
            id: item.id,
          },
        });

        await this.prismaService.$transaction([
          this.prismaService.promoCode.update({
            where: {
              promo: promoUsageEntry.promo,
            },
            data: {
              amount: {
                increment: promoUsageEntry.usedAmount,
              },
              PromoUsage: {
                update: {
                  where: {
                    id: item.id,
                  },
                  data: {
                    usedAmount: {
                      decrement: promoUsageEntry.usedAmount,
                    },
                  },
                },
              },
            },
          }),
          this.prismaService.promoUsage.deleteMany({
            where: {
              usedAmount: 0,
            },
          }),
        ]);
      }
    });
  }

  async stripeWebhook(stripeSignature: any, body: any, @Res() res: Response) {
    const endpointSecret =
      'whsec_9d631637c6869a9f12544f4a2344d0172e91df2f9e5bd5dd188bccb5c1250dae';
    let event;
    try {
      event = this.stripeService.webhooks.constructEvent(
        body,
        stripeSignature,
        endpointSecret,
      );
    } catch (err) {
      console.log({ err });
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      case 'charge.refunded':
        const paymentIntent = event.data.object.payment_intent;
        if (paymentIntent) {
          const existingRedeemption =
            await this.prismaService.promoUsage.findUnique({
              where: { paymentIntent },
            });
          if (existingRedeemption) {
            const result = await this.prismaService.$transaction([
              this.prismaService.promoCode.update({
                where: {
                  promo: existingRedeemption.promo,
                },
                data: {
                  amount: {
                    increment: existingRedeemption.usedAmount,
                  },
                  PromoUsage: {
                    update: {
                      where: {
                        paymentIntent,
                      },
                      data: {
                        usedAmount: {
                          decrement: existingRedeemption.usedAmount,
                        },
                      },
                    },
                  },
                },
              }),
              this.prismaService.promoUsage.delete({
                where: { paymentIntent },
              }),
            ]);
            const used_amount = existingRedeemption.usedAmount;
            const coupon_code = result?.[0].promo;
            const amount_left = result?.[0].amount;
            const to_email = result?.[0].email;
            const data = {
              service_id: 'service_0z8txkg',
              template_id: 'template_f352gaf',
              user_id: 'D9WeGnhaGJceVldKx',
              accessToken: '8YvwMOeLzUHsF3zs7Z0EK',
              template_params: {
                used_amount,
                coupon_code,
                amount_left,
                to_email,
              },
            };
            axios
              .post('https://api.emailjs.com/api/v1.0/email/send', data)
              .catch((err) => console.log(err));
          }
        }
        // console.log({ paymentIntent: event.data.object.payment_intent });
        break;
      // ... handle other event types
      default:
        console.log(
          `Unhandled event type ${event.type} ${event.data.object.payment_intent}`,
        );
    }

    // Return a 200 response to acknowledge receipt of the event
    res.status(HttpStatus.OK).send();
  }
}
