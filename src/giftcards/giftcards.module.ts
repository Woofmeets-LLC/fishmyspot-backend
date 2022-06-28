import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { GiftcardsController } from './giftcards.controller';
import { GiftcardsService } from './giftcards.service';

@Module({
  imports: [PrismaModule],
  controllers: [GiftcardsController],
  providers: [PrismaService, GiftcardsService],
})
export class GiftcardsModule {}
