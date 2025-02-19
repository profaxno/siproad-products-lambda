import { PfxHttpModule } from 'profaxnojs/axios';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductsCompanyService } from './products-company.service';

@Module({
  imports: [ConfigModule, PfxHttpModule],
  providers: [ProductsCompanyService],
  exports: [ProductsCompanyService]
})
export class ProductsModule {}
