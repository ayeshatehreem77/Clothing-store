import { IsNotEmpty, IsArray, IsNumber, IsMongoId } from 'class-validator';

export class CreateOrderDto {
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @IsArray()
  products: {
    productId: string;
    quantity: number;
  }[];

  @IsNumber()
  @IsNotEmpty()
  totalPrice: number;
}
