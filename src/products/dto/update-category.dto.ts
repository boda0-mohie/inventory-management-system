import { IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateCategoryDto {
    @IsOptional()
    @IsString()
    @ApiProperty({ description: 'The name of the category', example: 'Electronics' })
    name?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ description: 'The description of the category', example: 'Electronic devices' })
    description?: string;
}
