import { Prop } from "@nestjs/mongoose";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, MinLength, isArray } from "class-validator";
import { SingleAnswer, MultipleAnswer, FillAnswer } from "./answer.dto";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/auth/schemas/user.schema";
import { CompletedQuizzes } from "../schemas/completed.quizzes.schema";

export class SummarizedQuizDto {

    @ApiProperty({
        description: 'Quiz name',
        type: String,
    })
    name : string

    @ApiProperty({
        description: 'Summarized Participants',
        type: [CompletedQuizzes],
    })
    summarizedParticipants: CompletedQuizzes[]
    
}