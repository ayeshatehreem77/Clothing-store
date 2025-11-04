import { IsString, IsNotEmpty, IsEnum, IsNumber} from "class-validator";

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsEnum(["DIOR", "CHANEL", "GUCCI"], {
       message: "Give Valid Brand Name"
    })
    brand: "DIOR" | "CHANEL" | "GUCCI";

    @IsNumber()
    price: number;

    @IsString()
    description: string;

    @IsString()
    imageUrl: string;

    @IsNumber()
    stock: number;
}