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
    @IsNumber()
    price?: number;

    @IsOptional()
    @IsNumber()
    stock?: number;

    @IsOptional()
    @IsNumber()
    category_id?: number;

    @IsOptional()
    @IsNumber()
    low_stock_threshold?: number;
}