import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { WebhookModule } from './webhook/webhook.module';
import { CounterService } from './counter/counter.service';
import { PostgresService } from './utils/postgres.service';
import { UtilsService } from './utils/utils.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the configuration module global
      load: [() => require('../config.json')], // Replace with the correct path to your config.json file
    }),
    WebhookModule,
  ],
  controllers: [AppController],
  providers: [AppService, CounterService, PostgresService, UtilsService],
})
export class AppModule {}
