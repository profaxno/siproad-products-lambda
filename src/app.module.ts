import { Module } from '@nestjs/common';
import { ProductsLambdaModule } from './products-lambda/products-lambda.module';

@Module({
  imports: [ProductsLambdaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
