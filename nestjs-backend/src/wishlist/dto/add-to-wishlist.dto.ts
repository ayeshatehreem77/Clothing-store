import { IsMongoId, IsNotEmpty } from 'class-validator';

export class AddToWishlistDto {
  @IsMongoId()
  @IsNotEmpty()
  productId: string;
}
