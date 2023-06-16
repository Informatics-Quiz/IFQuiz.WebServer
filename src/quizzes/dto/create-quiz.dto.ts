import { Prop } from "@nestjs/mongoose";
import { IsBoolean, IsEmpty, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { User } from "../../auth/schemas/user.schema";
import { QuestionDto } from "./question.dto";

export class CreateQuizDto {

    @IsNotEmpty()
    @MinLength(3)
    @IsString()
    readonly name : string

    @IsNotEmpty()
    @MinLength(5)
    @IsString()
    readonly description : string

    @IsEmpty({ message: "Can't pass user id."}) // Author
    readonly user: User

    @IsOptional()
    @IsBoolean()
    @Prop({default: false})
    readonly hideCorrectAnswer: boolean

    @IsNotEmpty()
    readonly questions: QuestionDto[] = [];

    @IsOptional()
    readonly codeJoin: string

    @IsOptional()
    readonly deployed: boolean

}