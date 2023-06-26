import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";

// @F1 : import document make u easy don't have to add _id field to class User
import { Document } from 'mongoose'

@Schema({
    timestamps: true
})
export class User extends Document {    // @F1 : extends it by Document
    
    @ApiProperty({
        description: "User's email",
        example: "example@gmail.com"
    })
    @Prop({required: true, unique: true})
    email: string

    @ApiProperty({
        description: "User's password",
        example: "123456"
    })
    @Prop({required: true})
    password: string

    @ApiProperty({
        description: "User's fullname",
        example: "Nguyen Van A"
    })
    @Prop({required: true})
    fullname: string

    @ApiProperty({
        description: "User's status",
        example: "🤔 What you thinking ?"
    })
    @Prop({default: "🤔 What you thinking ?"})
    status: string


    @ApiProperty({
        description: "User's birthday",
        example: "2000-01-01"
    })
    @Prop({required: true})
    birthday : Date


    @ApiProperty({
        description: "User image path",
        example: "f105a6a0-d707-4828-9e98-02d8f55b2ca4.png"
    })
    @Prop({default: null})
    imageUrl : string


}

export const UserSchema = SchemaFactory.createForClass(User);