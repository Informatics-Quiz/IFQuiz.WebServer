
export function initializedStatus(quizzes : any[]){
    const date = new Date()
    const newQuizzes = quizzes.map((quiz) => {
        const newQuiz = quiz.toObject()
        newQuiz.success = date > quiz.expiredAt
        return newQuiz
    })
    return newQuizzes;
}