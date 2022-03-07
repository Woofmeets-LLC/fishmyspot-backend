import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharetribeModule } from './sharetribe/sharetribe.module';
import { PrismaModule } from './prisma/prisma.module';
import { SecretService } from './secret/secret.service';
import { SecretModule } from './secret/secret.module';
import { ConfigModule } from '@nestjs/config';
import { FileModule } from './file/file.module';
import { FishesModule } from './fishes/fishes.module';
import { PaymentService } from './payment/payment.service';
import { PaymentModule } from './payment/payment.module';
import { PaypalModule } from './paypal/paypal.module';
import { TaskService } from './task/task.service';
import { TaskModule } from './task/task.module';
import { ScheduleModule } from '@nestjs/schedule';

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
    TaskModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService, SecretService, PaymentService, TaskService],
})
export class AppModule {}
