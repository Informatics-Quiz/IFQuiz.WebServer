import { Logger } from '@nestjs/common';
import { FillAnswer } from 'src/quizzes/dto/answer.dto';
import { QuestionDto } from "src/quizzes/dto/question.dto";
import { CompletedQuizzes } from "src/quizzes/schemas/completed.quizzes.schema";
import { RunningQuizzes } from "src/quizzes/schemas/running.quizzes.schema";

const logger = new Logger('CheckAnswer')


// helper function FillChoice (chat-gpt3)
function isAnswerCorrect(correctAnswer: any, answer: string): boolean {
    for (const answerData of correctAnswer) {
        if (answerData.type === 'is-exactly') {
            if (answer === answerData.matchString) {
                return true;
            }
        }
        if (answerData.type === 'contains') {
            if (answer !== null && answer !== undefined) {
                const words = answer.split(' ');
                if (words.includes(answerData.matchString)) {
                    return true;
                }
            }
        }
    }
    return false;
}
// helper function FillChoice (chat-gpt3)


const checkFillChoice = (question: QuestionDto, answer: any) => {
    const correctAnswer = question.answer
    const isCorrect = isAnswerCorrect(correctAnswer, answer.matchString)
    logger.log(`fill-choice: correctAnswer: ${JSON.stringify(correctAnswer)} answer: ${answer.matchString} add-points: ${isCorrect ? question.points : 0}`)
    return isCorrect ? question.points : 0
}

// helper function MultipleChoice (chat-gpt3)
function checkMatchingIds(correctIds: number[], answerIds: number[]): boolean {
    if (!correctIds || correctIds.length === 0) {
        return true; // Return true if there are no correctIds to match
    }

    if (!answerIds || answerIds.length === 0) {
        return false;
    }

    const sortedCorrectIds = correctIds.sort();
    const sortedAnswerIds = answerIds.sort();

    let correctIndex = 0;
    for (const answerId of sortedAnswerIds) {
        if (answerId === sortedCorrectIds[correctIndex]) {
            correctIndex++;
            if (correctIndex === sortedCorrectIds.length) {
                return true; // All correctIds found in answerIds
            }
        }
    }

    return false; // Not all correctIds found in answerIds
}
// helper function MultipleChoice (chat-gpt3)

const checkMultipleChoice = (question: QuestionDto, answer: any) => {
    const correctIds = question.answer.map((item, index) => ((item as any).checked ? index : null))
        .filter((index) => index !== null);

    const isCorrect = checkMatchingIds(correctIds, answer.selectedIds);
    logger.log(`multiple-choice: correctIds: ${JSON.stringify(correctIds)} answerIds: ${JSON.stringify(answer.selectedIds)} add-points: ${isCorrect ? question.points : 0}`)
    return isCorrect ? question.points : 0
}

const checkSingleChoice = (question: QuestionDto, answer: any) => {
    const correctId = question.answer.findIndex((ans) => (ans as any).checked)
    const isCorrect = correctId === answer.selectedId
    logger.log(`single-choice: correctId: ${correctId} answerId: ${answer.selectedId} add-points: ${isCorrect ? question.points : 0}}`)
    return isCorrect ? question.points : 0
}

const checkAnswerMaps: Object = {
    'single-choice': checkSingleChoice,
    'fill-choice': checkFillChoice,
    'multiple-choice': checkMultipleChoice
}


class SingleAnswerCheckDoneDto {
    selectedId: number
}
class MultipleAnswerCheckDoneDto {
    selectedIds: number[]
}

class MatchStringAnswerCheckDoneDto {
    matchString: string
}

const checkTaskDoneSingleChoice = (answer: SingleAnswerCheckDoneDto) => {
    return answer.selectedId !== null && answer !== undefined
}

const checkTaskDoneFillChoice = (answer: MatchStringAnswerCheckDoneDto) => {
    return answer !== null && answer !== undefined
}

const checkTaskDoneMultipleChoice = (answer: MultipleAnswerCheckDoneDto) => {
    return answer.selectedIds.length > 0
}



const taskDoneCheck: Object = {
    'single-choice': checkTaskDoneSingleChoice,
    'fill-choice': checkTaskDoneFillChoice,
    'multiple-choice': checkTaskDoneMultipleChoice
}

export function checkQuizCompleted(quiz: RunningQuizzes) {
    logger.log(`checkQuizCompleted: ${JSON.stringify(quiz)}`)

    let checkedQuiz: any = {};

    checkedQuiz.score = 0;
    checkedQuiz.user = quiz.user;
    checkedQuiz.questions = quiz.questions;
    checkedQuiz.copyof = quiz.copyof;
    checkedQuiz.expiredAt = new Date(quiz.expiredAt);
    checkedQuiz.answers = quiz.answers;
    checkedQuiz.selectedQuestionId = quiz.selectedQuestionId;
    checkedQuiz.correctTotal = 0;
    checkedQuiz.incorrectTotal = 0;
    checkedQuiz.taskDoneTotal = 0;
    checkedQuiz.isPass = false
    checkedQuiz.highestCorrectStreak = 0;
    let currentCorrectStreak = 0;

    for (let id = 0; id < quiz.questions.length; id++) {
        const question = quiz.questions[id];
        const answers = quiz.answers[id];
        const pointsToAdd = checkAnswerMaps[question.type](question, answers);

        if (taskDoneCheck[question.type](answers)) {
            checkedQuiz.taskDoneTotal++
        }

        if (pointsToAdd > 0) {
            checkedQuiz.score += pointsToAdd
            checkedQuiz.correctTotal += 1
            currentCorrectStreak++;
            checkedQuiz.highestCorrectStreak = Math.max(checkedQuiz.highestCorrectStreak, currentCorrectStreak); // Update highest correct streak
        } else {
            currentCorrectStreak = 0;
            checkedQuiz.incorrectTotal++;
        }
    }

    if (checkedQuiz.score > quiz.copyof.points / 2) {
        checkedQuiz.isPass = true
    }


    return checkedQuiz;
}


export function checkQuizzesCompleted(quizzes: RunningQuizzes[]) {
    let completedQuizzes: CompletedQuizzes[] = [];

    for (const quiz of quizzes) {
        let checkedQuiz: any = {};
        checkedQuiz.score = 0;

        // Copy the properties from the original quiz to the checkedQuiz
        checkedQuiz.user = quiz.user;
        checkedQuiz.questions = quiz.questions;
        checkedQuiz.copyof = quiz.copyof;
        checkedQuiz.expiredAt = new Date(quiz.expiredAt);
        checkedQuiz.answers = quiz.answers;
        checkedQuiz.selectedQuestionId = quiz.selectedQuestionId;
        checkedQuiz.correctTotal = 0;
        checkedQuiz.incorrectTotal = 0;
        checkedQuiz.taskDoneTotal = 0;
        checkedQuiz.isPass = false
        checkedQuiz.highestCorrectStreak = 0;
        let currentCorrectStreak = 0;
    

        // Calculate the score based on the question and answers
        for (let id = 0; id < quiz.questions.length; id++) {
            const question = quiz.questions[id];
            const answers = quiz.answers[id];
            const pointsToAdd = checkAnswerMaps[question.type](question, answers);

            if (taskDoneCheck[question.type](answers)) {
                checkedQuiz.taskDoneTotal++
            }

            if (pointsToAdd > 0) {
                logger.log(`added points: ${pointsToAdd}`)
                checkedQuiz.score += pointsToAdd
                checkedQuiz.correctTotal += 1
                logger.log(`added correctTotal: ${checkedQuiz.correctTotal}`)
                currentCorrectStreak++;
                checkedQuiz.highestCorrectStreak = Math.max(checkedQuiz.highestCorrectStreak, currentCorrectStreak); // Update highest correct streak
            } else {
            currentCorrectStreak = 0;
            checkedQuiz.incorrectTotal++;
            }
        }

        if (checkedQuiz.score > quiz.copyof.points / 2) {
            checkedQuiz.isPass = true
        }

        completedQuizzes.push(checkedQuiz);
    }


    return completedQuizzes;
}