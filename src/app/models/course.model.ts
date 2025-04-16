export interface CourseType {
    id: number;
    title: string;
    description: string;
    difficultyLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    content: string;
    examples: string;
    generatedByAi: boolean;
    createdAt: string;
    updatedAt: string;
    lessons: LessonType[];
    quizzes: QuizType[];
    studentProgresses: StudentProgressType[];
    exampleHistories: ExampleHistoryType[];
}
export interface QuizQuestion {
    question: string;
    ansA: string;
    ansB: string;
    ansC: string;
    ansD: string;
    correctAns: string;
}

export interface LessonType {
    id: number;
    title: string;
    content: string;
    examples: string;
    createdAt: string;
    updatedAt: string;
    quizzes: QuizType[];
    studentProgresses: StudentProgressType[];
    exampleHistories: ExampleHistoryType[];
}

export interface QuizType {
    id: number;
    title: string;
    questions: string;
    createdAt: string;
    updatedAt: string;
}

export interface StudentProgressType {
    id: number;
    studentId: number;
    completed: boolean;
    score: number;
    weakAreas: string;
    createdAt: string;
    updatedAt: string;
}

export interface ExampleHistoryType {
    id: number;
    studentId: number;
    newExample: string;
    regeneratedAt: string;
}
