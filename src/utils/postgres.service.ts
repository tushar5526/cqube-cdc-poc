// postgres.service.ts
import { Injectable } from '@nestjs/common';
import { Pool, QueryResult } from 'pg';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PostgresService {
  private readonly pool: Pool;

  constructor(private configService: ConfigService) {
    this.pool = new Pool({
      user: this.configService.get('DATABASE_USERNAME'),
      host: this.configService.get('DATBASE_HOST'),
      database: this.configService.get('DATABASE_NAME'),
      password: this.configService.get('DATABASE_PASSWORD'),
      port: this.configService.get('DATABASE_PORT'),
    });
  }

  async query(text: string, values?: any[]): Promise<QueryResult<any>> {
    return this.pool.query(text, values);
  }
}
