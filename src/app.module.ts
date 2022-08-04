import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileModule } from './file/file.module';
import { FishesModule } from './fishes/fishes.module';
import { GiftcardsModule } from './giftcards/giftcards.module';
import { PaymentModule } from './payment/payment.module';
import { PaymentService } from './payment/payment.service';
import { PaypalModule } from './paypal/paypal.module';
import { PrismaModule } from './prisma/prisma.module';
import { SecretModule } from './secret/secret.module';
import { SecretService } from './secret/secret.service';
import { SharetribeModule } from './sharetribe/sharetribe.module';
import { StripeModule } from './stripe/stripe.module';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SharetribeModule,
    PrismaModule,
    SecretModule,
    FileModule,
    FishesModule,
    PaymentModule,
    PaypalModule,
    GiftcardsModule,
    StripeModule,
    ScheduleModule.forRoot(),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, SecretService, PaymentService],
})
export class AppModule {}
