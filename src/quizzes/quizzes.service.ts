import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { Quizzes } from './schemas/quizzes.schema';

@Injectable()
export class QuizzesService {
    constructor(
        @InjectModel(Quizzes.name)
        private quizzesModel: Model<Quizzes>
    ){}

    // get all quizzes
    async getAll() : Promise<Quizzes[]>{
        const quizzes = await this.quizzesModel.find()
        return quizzes
    }

    // get one quiz ( By Id )
    async get(id: string) : Promise<Quizzes> {
        const quiz = await this.quizzesModel.findById(id)
        if(!quiz){
            throw new NotFoundException('Quiz not found!')
        }
        return quiz
    }

    // create quiz
    async create(newQuiz: Quizzes) : Promise<Quizzes> {
        const { name, description, category } = newQuiz

        const quiz = await this.quizzesModel.create({
            name,
            description,
            category
        })

        return quiz
    }

    // delete quiz ( By Id )
    async delete(id: string) : Promise<string> {
        const res = await this.quizzesModel.findByIdAndDelete(id);
        if(!res){
            throw new NotFoundException('Quiz not found!')
        }

        return 'Quiz deleted.'
    }

    // update quiz ( By Id )
    async put(id: string, updateQuiz: Quizzes) : Promise<Quizzes> {
        return await this.quizzesModel.findByIdAndUpdate(id, updateQuiz, {
            new: true,
            runValidators: true
        })
    }

}
