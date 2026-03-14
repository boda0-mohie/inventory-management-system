import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCategoryDto {
    @ApiProperty({ description: 'The name of the category', example: 'Electronics' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ description: 'A detailed description of the category', example: 'Devices, gadgets, and electronic equipment' })
    @IsString()
    description: string;
}