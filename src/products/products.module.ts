import { PfxHttpModule } from 'profaxnojs/axios';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductsService } from './products.service';

@Module({
  imports: [ConfigModule, PfxHttpModule],
  providers: [ProductsService],
  exports: [ProductsService]
})
export class ProductsModule {}
