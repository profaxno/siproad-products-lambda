import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ProductsLambdaService {

  private readonly logger = new Logger(ProductsLambdaService.name);

  async handleEvent(event: any): Promise<any> {
    const start = performance.now();
    
    this.logger.log(`handleEvent: starting process...`);

    let successfulMessages: string[] = [];
    let failedMessages: { itemIdentifier: string }[] = [];

    for (const record of event.Records) {
      try {
        this.logger.log(`handleEvent: processing messageId=${record.messageId}, message=${record.body}`);
        
        // Simulación de éxito o fallo
        if (record.body.includes("error") || record.body.includes("ERROR")) {
          throw new Error("mensaje con error");
        }

        successfulMessages.push(record.messageId);
      } catch (error) {
        console.error(`handleEvent: messageId=${record.messageId}, error`, error.message);
        failedMessages.push({ itemIdentifier: record.messageId });
      }
    }

    const end = performance.now();
    this.logger.log(`<<< handleEvent: executed, runtime=${(end - start) / 1000} seconds`);
    
    return { batchItemFailures: failedMessages };

    // return {
    //   statusCode: 200,
    //   body: JSON.stringify({ message: 'Event processed successfully' }),
    // };
  }
}
