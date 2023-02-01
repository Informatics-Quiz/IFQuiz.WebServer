/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose" />
/// <reference types="mongoose/types/inferschematype" />
export declare enum Category {
    MATH = "Mathematics",
    SCIENCE = "Science",
    ENG = "English Language",
    COMSCI = "Computer Science",
    PE = "Physical Education",
    ART = "Creative Arts",
    LANGUAGE = "World Language"
}
export declare class Quizzes {
    name: string;
    description: string;
    category: Category;
}
export declare const QuizzesSchema: import("mongoose").Schema<Quizzes, import("mongoose").Model<Quizzes, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Quizzes>;
