import { IsString, IsEmail, IsNotEmpty, IsEnum, isEmpty, IsStrongPassword } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    email: string;

    @IsEnum(["admin" , "user"], {
       message: "Give Valid Role"
    })
    role: "admin" | "user"

    @IsStrongPassword()
    password: string
}