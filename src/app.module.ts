import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { config } from './config/app.config';
import { ProductsLambdaModule } from './products-lambda/products-lambda.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [config]
    }),
    ProductsLambdaModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
