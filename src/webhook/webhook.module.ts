import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { CounterService } from 'src/counter/counter.service';
import { PostgresService } from 'src/utils/postgres.service';
import { UtilsService } from 'src/utils/utils.service';

@Module({
  providers: [WebhookService, CounterService, PostgresService, UtilsService],
  controllers: [WebhookController],
})
export class WebhookModule {}
