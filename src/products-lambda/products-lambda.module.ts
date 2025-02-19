import { Module } from '@nestjs/common';

import { ProductsLambdaService } from './products-lambda.service';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [ProductsModule],
  controllers: [],
  providers: [ProductsLambdaService],
})
export class ProductsLambdaModule {}
