import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { UtilsService } from 'src/utils/utils.service';

@Injectable()
export class CounterService {
  constructor(
    private readonly configService: ConfigService,
    private readonly utilsService: UtilsService,
  ) {}

  private logger = new Logger('CounterService');
  private basefolder = this.configService.get('COUNTERS_BASE_FOLDER');

  generateCounters(
    date: string,
    eventName: string,
    programName: string,
    eventData: any,
  ) {
    this.logger.debug(
      `Received event: ${eventName} for date: ${date} with data: ${JSON.stringify(
        eventData,
      )} in program: ${programName}`,
    );
    // create a folder name if exists with the date
    const folderName = path.join(this.basefolder, date, programName);
    if (!fs.existsSync(folderName)) {
      this.logger.error(
        `Event ${eventName} for program ${programName} with date ${date} is not initailized`,
      );
      throw new BadRequestException(
        HttpStatus.BAD_REQUEST,
        `Event ${eventName} for program ${programName} with date ${date} is not initailized`,
      );
    }

    // Files are named as eventName-event.data.{number}.csv
    // Get the next file name
    const files = fs.readdirSync(folderName);
    const nextFileNumber = files.length + 1;
    const fileName = `${eventName}-event.data.${nextFileNumber}.csv`;
    const filePath = path.join(folderName, fileName);
    this.utilsService.writeCSV(filePath, eventData);
  }

  initCounters(eventName: string, programName: string, data: Array<any>) {
    this.logger.debug(
      `Received Init event: ${eventName}  with data: ${JSON.stringify(
        data,
      )} in program: ${programName}`,
    );
    data.forEach((element) => {
      console.log(element);
      const fileName = `${eventName}-event.data.1.csv`;
      const datefolderName = path.join(this.basefolder, element.date);
      if (!fs.existsSync(datefolderName)) {
        this.logger.log(`Creating folder ${datefolderName}`);
        fs.mkdirSync(datefolderName);
      }
      const programFolderName = path.join(datefolderName, programName);
      if (!fs.existsSync(programFolderName)) {
        this.logger.log(`Creating folder ${programFolderName}`);
        fs.mkdirSync(programFolderName);
      }
      const filePath = path.join(programFolderName, fileName);
      this.utilsService.writeCSV(filePath, element);
    });
  }
}
