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
    @IsNumber()
    price: number;

    @IsNotEmpty()
    @IsNumber()
    stock: number;

    @IsNotEmpty()
    @IsNumber()
    category_id: number;

    @IsNotEmpty()
    @IsNumber()
    low_stock_threshold: number;
}