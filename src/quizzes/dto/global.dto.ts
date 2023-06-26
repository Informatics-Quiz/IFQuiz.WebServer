import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class QueryQuizIdDto {
    @ApiProperty({
        description: "Quiz id",
        example: "60f0b0b3e3b3a3b3a3b3a3b3",
        type: String,
        required: true
    })
    quizId: string
}

export class QueryGetAllQuizDto {
    @ApiProperty({
        description: "Quiz name",
        example: "Quiz 1",
        type: String,
        required: false
    })
    @IsOptional()
    name: string

    @ApiProperty({
        description: "Is get owned quiz",
        example: true,
        type: Boolean,
        required: false
    })
    @IsOptional()  
    owned: boolean
}

export class QueryGetDeployedQuizDto {


    @ApiProperty({
        description: "Deployed quiz id",
        example: "60f0b0b3e3b3a3b3a3b3a3b3",
        type: String,
        required: false
    })
    @IsOptional()
    quizId: string


    @ApiProperty({
        description: "Deployed quiz code",
        example: "XZC123",
        type: String,
        required: false
    })
    @IsOptional()
    codeJoin: string

}