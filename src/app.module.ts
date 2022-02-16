import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharetribeModule } from './sharetribe/sharetribe.module';
import { PrismaModule } from './prisma/prisma.module';
import { SecretService } from './secret/secret.service';
import { SecretModule } from './secret/secret.module';
import { ConfigModule } from '@nestjs/config';
import { FileModule } from './file/file.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SharetribeModule,
    PrismaModule,
    SecretModule,
    FileModule,
  ],
  controllers: [AppController],
  providers: [AppService, SecretService],
})
export class AppModule {}
