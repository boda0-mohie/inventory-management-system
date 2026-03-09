import { IsNotEmpty, IsNumber, IsString, MinLength } from "class-validator";

export class CreateProductDto {
    @IsNotEmpty()
    @MinLength(3)
    @IsString()
    name: string;

    @IsNotEmpty()
    @MinLength(3)
    @IsString()
    description: string;

    @IsNotEmpty()
    @MinLength(1)
    @IsNumber()
    price: number;

    @IsNotEmpty()
    @MinLength(1)
    @IsNumber()
    stock: number;

    @IsNotEmpty()
    @IsNumber()
    category_id: number;

    @IsNotEmpty()
    @MinLength(1)
    @IsNumber()
    low_stock_threshold: number;
}