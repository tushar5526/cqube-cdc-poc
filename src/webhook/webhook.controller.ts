import { Body, Controller, Post } from '@nestjs/common';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}
  @Post('estuary')
  estuaryWebhook(@Body() body: Array<any>) {
    const tableName = `${body[0]._meta.source.schema}.${body[0]._meta.source.table}`;
    if (body.length == 1) {
      delete body[0]._meta;
      return this.webhookService.estuaryWebhook(tableName, body);
      return;
    }
    return this.webhookService.estuaryWebhook(tableName, body, true);
  }
}
