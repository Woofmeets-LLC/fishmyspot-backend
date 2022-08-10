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
import {
  ApplyPromoDTO,
  ApproveTransactionDTO,
  GetDiscountDTO,
  GetPromoDTO,
  InvalidateDiscountsDTO,
} from './dto';

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
        const vouchers: string[] = await this.getVoucher(amount);
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

  async getVoucher(amount): Promise<string[]> {
    const entries = await this.prismaService.promoCode.findMany({
      where: { amount },
      select: { promo: true },
    });

    const promoEntries = entries.map((entry) => entry.promo);

    let pureVouchers = new Set<string>();
    while (pureVouchers.size === 0) {
      const vouchers = voucherify.generate({
        count: 10,
        pattern: `FMS${amount}-######`,
        charset: voucherify.charset('alphanumeric'),
      });
      const setOfEntries = new Set<string>(promoEntries);

      pureVouchers = new Set<string>(
        vouchers.filter((voucher) => !setOfEntries.has(voucher)),
      );
    }
    return [...pureVouchers];
  }

  async getDiscount(body: GetDiscountDTO) {
    const amount = body.amount;
    const valid = body.valid;

    const vouchers: string[] = await this.getVoucher(amount);
    try {
      const result = await this.prismaService.promoCode.create({
        data: {
          promo: vouchers[0],
          amount,
          email: 'info@fishmyspot.com',
          type: 'DISCOUNT',
          valid,
        },
      });
      return result;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new ForbiddenException(
            'A promo code generation failed. Please try again.',
          );
        }
      }
    }
  }

  async invalidateCoupons(body: InvalidateDiscountsDTO) {
    const { coupons } = body;

    try {
      const result = await this.prismaService.promoCode.updateMany({
        where: {
          promo: {
            in: coupons,
          },
        },
        data: {
          valid: false,
        },
      });
      return result;
    } catch (err) {
      throw new ForbiddenException('Something went wrong. Please try again.');
    }
  }

  async updateDiscount(amount: number, valid: boolean, coupon: string) {
    try {
      const result = await this.prismaService.promoCode.update({
        where: { promo: coupon },
        data: {
          amount,
          valid,
        },
      });
      return result;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new ForbiddenException('Record to update not found.');
        }
      }
    }
  }

  async verifyPromo(code: string) {
    const existingPromo = await this.prismaService.promoCode.findUnique({
      where: { promo: code },
    });
    if (existingPromo) {
      delete existingPromo.paymentIntent;
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
      if (promoEntry?.amount >= usedAmount && promoEntry?.valid) {
        if (promoEntry?.type === 'GIFTCARD') {
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
        } else if (promoEntry?.type === 'DISCOUNT') {
          const entry = await this.prismaService.promoCode.update({
            where: { promo },
            data: {
              valid: false,
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
          //with bearer token

          return entry;
        }
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
      axios
        .get(
          `${this.configService.get<string>(
            'CMS_URL',
          )}/api/discount-cards/?filters[coupon][$eq]=${result.promo}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.CMS_API_TOKEN}`,
            },
          },
        )
        .then((res) => {
          if (res.data.data.length != 0) {
            axios
              .delete(
                `${this.configService.get<string>(
                  'CMS_URL',
                )}/api/discount-cards/${res.data.data[0].id}`,
                {
                  headers: {
                    Authorization: `Bearer ${process.env.CMS_API_TOKEN}`,
                  },
                },
              )
              .then((res) => {
                console.log({ res });
              })
              .catch((err) => console.log({ error: err.message }));
          }
        })
        .catch((err) => console.log({ error: err.message }));
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

        const promoCodeEntry = await this.prismaService.promoCode.findUnique({
          where: {
            promo: promoUsageEntry.promo,
          },
        });
        if (promoCodeEntry.type === 'GIFTCARD') {
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
        } else {
          await this.prismaService.$transaction([
            this.prismaService.promoCode.update({
              where: {
                promo: promoUsageEntry.promo,
              },
              data: {
                valid: true,
                PromoUsage: {
                  update: {
                    where: {
                      id: item.id,
                    },
                    data: {
                      usedAmount: 0,
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
      }
    });
  }

  async stripeWebhook(stripeSignature: any, body: any, @Res() res: Response) {
    const endpointSecret = this.configService.get<string>(
      'STRIPE_WEBHOOK_SECRET',
    );
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
