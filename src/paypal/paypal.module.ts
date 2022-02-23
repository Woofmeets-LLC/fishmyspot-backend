import { Module } from '@nestjs/common';
import { PaypalService } from './paypal.service';
import { PaypalController } from './paypal.controller';
import { SecretService } from 'src/secret/secret.service';

@Module({
  controllers: [PaypalController],
  providers: [PaypalService, SecretService],
  exports: [SecretService],
})
export class PaypalModule {}
