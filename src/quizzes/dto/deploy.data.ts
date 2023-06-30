import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class DeployDataDto {

    @ApiProperty({
        description: 'Quiz id',
        type: String,
        example: '649d8893a4e0f0dfcb684f7d'
    })
    @IsNotEmpty()
    @IsString()
    quizId: string

    @ApiProperty({
        description: 'Deploy at',
        type: Date,
        example: '2021-08-01T00:00:00.000Z'
    })
    @IsNotEmpty()
    deployAt: Date        
}