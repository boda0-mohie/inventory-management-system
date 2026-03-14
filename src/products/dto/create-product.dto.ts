import { IsNotEmpty, IsNumber, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateProductDto {
    @ApiProperty({ description: 'The name of the product', example: 'Laptop', minLength: 3 })
    @IsNotEmpty()
    @MinLength(3)
    @IsString()
    name: string;

    @ApiProperty({ description: 'A detailed description of the product', example: 'High-performance gaming laptop with 32GB RAM' })
    @IsNotEmpty()
    @MinLength(3)
    @IsString()
    description: string;

    @ApiProperty({ description: 'The unit price of the product', example: 1299.99 })
    @IsNotEmpty()
    @IsNumber()
    price: number;

    @ApiProperty({ description: 'The current stock quantity of the product', example: 50 })
    @IsNotEmpty()
    @IsNumber()
    stock: number;

    @ApiProperty({ description: 'The ID of the category this product belongs to', example: 1 })
    @IsNotEmpty()
    @IsNumber()
    category_id: number;

    @ApiProperty({ description: 'The threshold value to trigger low stock alerts', example: 10 })
    @IsNotEmpty()
    @IsNumber()
    low_stock_threshold: number;
}