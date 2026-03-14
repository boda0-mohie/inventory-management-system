import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
    @IsEmail()
    @MaxLength(150)
    @IsNotEmpty()
    @ApiProperty({ description: 'The email address of the user', example: 'staff@gmail.com' })
    email: string;
    
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @ApiProperty({ description: 'The password of the user', example: 'password', minLength: 6 })
    password: string;
}