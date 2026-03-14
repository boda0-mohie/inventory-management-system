import { IsNumber, IsOptional, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateProductDto {
    @IsOptional()
    @MinLength(3)
    @IsString()
    @ApiProperty({ description: 'The name of the product', example: 'Laptop', minLength: 3 })
    name?: string;

    @IsOptional()
    @MinLength(3)
    @IsString()
    @ApiProperty({ description: 'A detailed description of the product', example: 'High-performance gaming laptop with 32GB RAM' })
    description?: string;

    @IsOptional()
    @IsNumber()
    @ApiProperty({ description: 'The unit price of the product', example: 1299.99 })
    price?: number;

    @IsOptional()
    @IsNumber()
    @ApiProperty({ description: 'The current stock quantity of the product', example: 50 })
    stock?: number;

    @IsOptional()
    @IsNumber()
    @ApiProperty({ description: 'The ID of the category this product belongs to', example: 1 })
    category_id?: number;

    @IsOptional()
    @IsNumber()
    @ApiProperty({ description: 'The threshold value to trigger low stock alerts', example: 10 })
    low_stock_threshold?: number;
}