import { ApiProperty } from "@nestjs/swagger";

export class QueryQuizIdDto {
    @ApiProperty({
        description: "Quiz id",
        example: "60f0b0b3e3b3a3b3a3b3a3b3",
        type: String,
        required: true
    })
    quizId: string
}