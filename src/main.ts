import { NestFactory } from '@nestjs/core';
import { ProductsLambdaService } from './products-lambda/products-lambda.service';
import { ProductsLambdaModule } from './products-lambda/products-lambda.module';
import { APIGatewayEvent, Context, Callback, Handler, SQSEvent } from 'aws-lambda';
import { AppModule } from './app.module';

async function bootstrap(event: any, context: Context) {
  const app = await NestFactory.create(AppModule);
  const service = app.get(ProductsLambdaService);


  console.log('>>> siproad-products-lambda: starting process... event=', JSON.stringify(event));

  return service.handleEvent(event)
  .then( (response) => {
    console.log('<<< siproad-products-lambda: executed successfully');
    return response;
  })
  .catch((error) => {
    console.log('siproad-products-lambda: processing error', error);
    throw error;
  });
  
}

export const handler: Handler = bootstrap;

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   const lambdaService = app.get(ProductsLambdaService);

//   const handler = async (
//     event: APIGatewayEvent,
//     context: Context,
//     callback: Callback
//   ) => {
//     try {
//       const response = await lambdaService.handleEvent(event);
//       callback(null, response);
//     } catch (error) {
//       callback(error);
//     }
//   };

//   return handler;
// }

// export const handler = bootstrap();

