import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class UploadQuizCoverImageDto {

    @ApiProperty({
        description: "quiz id",
        type: String,
        example: "60f1b0a0e1b7a81f1c1a2b1a"
    })
    @IsNotEmpty()
    @IsString()
    quizId: string
}