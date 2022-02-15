import { Module } from '@nestjs/common';
import { SharetribeService } from './sharetribe.service';
import { SharetribeController } from './sharetribe.controller';

@Module({
  providers: [SharetribeService],
  controllers: [SharetribeController],
})
export class SharetribeModule {}
