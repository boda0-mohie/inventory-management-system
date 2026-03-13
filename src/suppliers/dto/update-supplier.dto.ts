import { IsEmail, IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateSupplierDto {
    @IsString()
    @IsOptional()
    @MaxLength(255)
    name?: string;

    @IsString()
    @IsOptional()
    @MaxLength(255)
    contact_person?: string;

    @IsEmail()
    @IsOptional()
    @MaxLength(255)
    email?: string;

    @IsString()
    @IsOptional()
    @MaxLength(50)
    phone?: string;

    @IsString()
    @IsOptional()
    address?: string;
}
