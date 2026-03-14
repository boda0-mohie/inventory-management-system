import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateSupplierDto {
    @ApiProperty({ description: 'The name of the supplier', example: 'Acme Corp' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    name: string;

    @ApiProperty({ description: 'The contact person at the supplier', example: 'John Doe', required: false })
    @IsString()
    @IsOptional()
    @MaxLength(255)
    contact_person?: string;

    @ApiProperty({ description: 'The email address of the supplier', example: 'contact@acme.com' })
    @IsEmail()
    @IsNotEmpty()
    @MaxLength(255)
    email: string;

    @ApiProperty({ description: 'The phone number of the supplier', example: '+1-555-0123' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    phone: string;

    @ApiProperty({ description: 'The physical address of the supplier', example: '123 Business Way, Industrial Park' })
    @IsString()
    @IsNotEmpty()
    address: string;
}
