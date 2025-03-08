import { PfxHttpMethodEnum, PfxHttpService, PfxHttpResponseDto } from 'profaxnojs/axios';

import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ProductsEnum } from './enums/products.enum';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  private siproadProductsHost: string = null;
  private siproadProductsApiKey: string = null;

  constructor(
    private readonly configService: ConfigService,
    private readonly pfxHttpService: PfxHttpService
  ) { 
    this.siproadProductsHost = this.configService.get('siproadProductsHost');
    this.siproadProductsApiKey = this.configService.get('siproadProductsApiKey');
  }

  update<T>(subPath: ProductsEnum, dto: T): Promise<PfxHttpResponseDto>{
    const start = performance.now();

    // * generate request values
    const method  = PfxHttpMethodEnum.PATCH;
    const path    = this.siproadProductsHost.concat(subPath);
    const headers = { "x-api-key": this.siproadProductsApiKey };
    const body    = dto;

    // * send request
    return this.pfxHttpService.request<PfxHttpResponseDto>(method, path, headers, body)
    .then(response => {

      if ( !(
        response.internalCode == HttpStatus.OK || 
        response.internalCode == HttpStatus.BAD_REQUEST || 
        response.internalCode == HttpStatus.NOT_FOUND) )
        throw new Error(`update: Error, response=${JSON.stringify(response)}`);

      const end = performance.now();
      this.logger.log(`update: OK, runtime=${(end - start) / 1000} seconds`);
      return response;
    })
    .catch(error => {
      this.logger.error(`update: ${error}`);
      throw error;
    })
  }

  delete(subPath: ProductsEnum, id: string): Promise<PfxHttpResponseDto>{
    const start = performance.now();

    // * generate request values
    const method  = PfxHttpMethodEnum.DELETE;
    const path    = this.siproadProductsHost.concat(subPath).concat(`/${id}`);
    const headers = { "x-api-key": this.siproadProductsApiKey };
    const body    = {};

    // * send request
    return this.pfxHttpService.request<PfxHttpResponseDto>(method, path, headers, body)
    .then(response => {

      if ( !(
        response.internalCode == HttpStatus.OK || 
        response.internalCode == HttpStatus.CREATED || 
        response.internalCode == HttpStatus.BAD_REQUEST || 
        response.internalCode == HttpStatus.NOT_FOUND) )
        throw new Error(`delete: Error, response=${JSON.stringify(response)}`);

      const end = performance.now();
      this.logger.log(`delete: OK, runtime=${(end - start) / 1000} seconds`);
      return response;
    })
    .catch(error => {
      this.logger.error(`delete: ${error}`);
      throw error;
    })
  }

}
