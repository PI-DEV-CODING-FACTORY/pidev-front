import { CourseType, LessonType } from './course.model';

export interface ExampleType {
    id: number;
    studentId: number;
    course: CourseType; // Replace 'any' with your Course type
    lesson: LessonType; // Replace 'any' with your Lesson type
    previousExample: string;
    newExample: string;
    regeneratedAt: Date;
}
