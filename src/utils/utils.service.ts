import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class UtilsService {
  private readonly logger = new Logger('UtilsService');
  writeCSV(filePath, data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const headerRow = keys.join(',') + '\n';
    const dataRow = values.join(',') + '\n';
    if (fs.existsSync(filePath)) {
      this.logger.log(`File ${filePath} exists, appending data`);
      try {
        fs.appendFileSync(filePath, dataRow);
      } catch (err) {
        this.logger.error(`Error writing to file ${filePath}`, err);
      }
      return;
    }
    this.logger.log(`File ${filePath} does not exist, creating file`);
    try {
      fs.writeFileSync(filePath, headerRow);
      fs.appendFileSync(filePath, dataRow);
    } catch (err) {
      this.logger.error(`Error writing to file ${filePath}`, err);
    }
  }
}
