import { PfxHttpResponseDto } from 'profaxnojs/axios';
import { ProcessSummaryDto } from 'profaxnojs/util';

import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { ProcessEnum, SourceEnum } from './enums';
import { Record, Event, Body, JsonBasic } from './interface';

import { ProductsCompanyDto } from 'src/products/dto/products-company.dto';
import { ProductsService } from 'src/products/products.service';
import { ProductsEnum } from 'src/products/enums/products.enum';
import { Message } from './interface/message.interface';

@Injectable()
export class ProductsLambdaService {

  private readonly logger = new Logger(ProductsLambdaService.name);

  constructor(
    private readonly productsService: ProductsService
  ) {}

  async processEvent(event: Event): Promise<any> {
    const start = performance.now();
    
    const recordsSize = event.Records ? event.Records.length : 0;
     
    //let successfulMessages: string[] = [];
    let failedMessages: { itemIdentifier: string }[] = [];
    let processSummaryDto = new ProcessSummaryDto(event.Records.length);

    if(recordsSize == 0) {
      this.logger.log(`processEvent: not executed (list empty)`);
      return { batchItemFailures: failedMessages };
    }

    this.logger.log(`processEvent: starting process... recordsSize=${recordsSize}`);

    let i = 0;
    for (const record of event.Records) {
      this.logger.warn(`[${i}] processEvent: processing message, messageId=${record.messageId}`);

      await this.processMessage(record)
      .then( (responseDto: PfxHttpResponseDto) => {
        processSummaryDto.rowsOK++;
        processSummaryDto.detailsRowsOK.push(`[${i}] messageId=${record.messageId}, response=${responseDto.message}`);
        this.logger.log(`[${i}] processEvent: message processed, messageId=${record.messageId}`);
      })
      .catch( (error) => {
        processSummaryDto.rowsKO++;
        processSummaryDto.detailsRowsKO.push(`[${i}] messageId=${record.messageId}, error=${error.message}`);
        this.logger.error(`[${i}] processEvent: error processing message, messageId=${record.messageId}, error`, error.message);
        failedMessages.push({ itemIdentifier: record.messageId });
      })
      .finally( () => {
        i++;
      })

    }

    const end = performance.now();
    this.logger.log(`processEvent: executed, runtime=${(end - start) / 1000} seconds, summary=${JSON.stringify(processSummaryDto)}`);
    
    // return {
    //   statusCode: 200,
    //   body: JSON.stringify({ message: 'Event processed successfully' }),
    // };

    return { batchItemFailures: failedMessages };
  }

  private processMessage(record: Record): Promise<PfxHttpResponseDto> {
    try {
      const body: any = JSON.parse(record.body);
      const message: Message = body.Message ? JSON.parse(body.Message) : body;  // * TIPS: When a message comes from an SNS the message has a message field, and when it comes from an SQS the body is the message

      // * replicate companies
      if(message.process == ProcessEnum.COMPANY_UPDATE) {
        const dto: ProductsCompanyDto = JSON.parse(message.jsonData);
        return this.productsService.update(ProductsEnum.PATH_COMPANY_UPDATE, dto);
      }

      if(message.process == ProcessEnum.COMPANY_DELETE) {
        const jsonBasic: JsonBasic = JSON.parse(message.jsonData);
        return this.productsService.delete(ProductsEnum.PATH_COMPANY_DELETE, jsonBasic.id);
      }
    
      const response = new PfxHttpResponseDto(HttpStatus.BAD_REQUEST, `process not implemented, source=${message.source}, process=${message.process}`);
      return Promise.resolve(response);
      
    } catch (error) {
      this.logger.error(`processMessage: error processing message, messageId=${record.messageId}, error`, error);
      return Promise.reject(error);
    }
  }

}
