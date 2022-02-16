import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SecretService {
  constructor(private readonly configService: ConfigService) {}

  getSharetribeIntegrationKeys() {
    return { port: this.configService.get<number>('PORT') };
  }
}
