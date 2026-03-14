import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateSupplierDto {
    @IsString()
    @IsOptional()
    @MaxLength(255)
    @ApiProperty({ description: 'The name of the supplier', example: 'Acme Corp' })
    name?: string;

    @IsString()
    @IsOptional()
    @MaxLength(255)
    @ApiProperty({ description: 'The contact person at the supplier', example: 'John Doe', required: false })
    contact_person?: string;

    @IsEmail()
    @IsOptional()
    @MaxLength(255)
    @ApiProperty({ description: 'The email address of the supplier', example: 'contact@acme.com' })
    email?: string;

    @IsString()
    @IsOptional()
    @MaxLength(50)
    @ApiProperty({ description: 'The phone number of the supplier', example: '+1-555-0123' })
    phone?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: 'The physical address of the supplier', example: '123 Business Way, Industrial Park' })
    address?: string;
}
