export class ProductsCompanyDto {
  
  id?: string;

  name: string;

  constructor(name: string, id?: string) {
    this.name = name;
    this.id = id;
  }
}
