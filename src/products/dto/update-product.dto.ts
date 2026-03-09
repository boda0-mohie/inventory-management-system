import { IsNumber, IsOptional, IsString, MinLength } from "class-validator";

export class UpdateProductDto {
    @IsOptional()
    @MinLength(3)
    @IsString()
    name?: string;

    @IsOptional()
    @MinLength(3)
    @IsString()
    description?: string;

    @IsOptional()
    @MinLength(1)
    @IsNumber()
    price?: number;

    @IsOptional()
    @MinLength(1)
    @IsNumber()
    stock?: number;

    @IsOptional()
    @IsNumber()
    category_id?: number;

    @IsOptional()
    @MinLength(1)
    @IsNumber()
    low_stock_threshold?: number;
}