import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class loginDTO {

    @IsNotEmpty()
    @IsEmail({}, {message: "Incorrect Email"})
    readonly email: string

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    readonly password: string

}

