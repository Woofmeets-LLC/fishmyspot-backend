import { Module } from '@nestjs/common';
import { SharetribeService } from './sharetribe.service';
import { SharetribeController } from './sharetribe.controller';
import { SharetribeIntegrationService } from './sharetribe.integration.service';
import { SecretService } from 'src/secret/secret.service';

@Module({
  providers: [SharetribeService, SharetribeIntegrationService, SecretService],
  controllers: [SharetribeController],
  exports: [SharetribeService, SharetribeIntegrationService, SecretService],
})
export class SharetribeModule {}
