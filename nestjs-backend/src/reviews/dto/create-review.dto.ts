import { IsNotEmpty, IsNumber, Min, Max, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  comment: string;
}
