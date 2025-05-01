import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QuizType } from '../models/course.model';

@Injectable({
    providedIn: 'root'
})
export class QuizService {
    private apiUrl = 'http://localhost:8087/api/quizzes';

    constructor(private http: HttpClient) {}

    fetchQuizzesFromApi() {
        return this.http.get<QuizType[]>(this.apiUrl);
    }

    fetchQuizzesByCourseAndLesson(courseId: number, lessonId: number) {
        return this.http.get<QuizType[]>(`${this.apiUrl}/course/${courseId}/lesson/${lessonId}`);
    }
}
