import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CounterService } from 'src/counter/counter.service';
import { PostgresService } from 'src/utils/postgres.service';
import * as format from 'string-template';

@Injectable()
export class WebhookService {
  constructor(
    private configService: ConfigService,
    private postgresService: PostgresService,
    private counterService: CounterService,
  ) {}

  private logger = new Logger('WebhookService');

  async estuaryWebhook(tableName: string, data: any, init = false) {
    this.logger.debug(`estuaryWebhook received for tablename: ${tableName}`);
    const programConfigData = this.configService.get(tableName);

    if (init) {
      this.logger.log(`Initializing for table ${tableName}`);

      for (const element of programConfigData) {
        const sqlQuery = element.initQuery;
        this.logger.debug(`Init sqlQuery: ${sqlQuery}`);
        const queryRes = await this.postgresService.query(sqlQuery);
        this.logger.debug(`SQL Query response`, queryRes.rows);
        this.counterService.initCounters(
          element.eventName,
          element.programName,
          queryRes.rows,
        );
      }
      return;
    }

    for (const element of programConfigData) {
      const sqlQuery = format(element.updateQuery, data[0]);
      this.logger.debug(`Generated sqlQuery: ${sqlQuery}`);
      const queryRes = await this.postgresService.query(sqlQuery);
      this.counterService.generateCounters(
        queryRes.rows[0].date.replaceAll('/', '-'),
        element.eventName,
        element.programName,
        queryRes.rows[0],
      );
    }
  }
}
