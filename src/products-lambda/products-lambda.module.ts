import { Module } from '@nestjs/common';
import { ProductsLambdaService } from './products-lambda.service';

@Module({
  imports: [],
  controllers: [],
  providers: [ProductsLambdaService],
})
export class ProductsLambdaModule {}
