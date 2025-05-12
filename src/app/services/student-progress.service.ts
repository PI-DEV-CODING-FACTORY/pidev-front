import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StudentProgress } from '../models/course.model';

@Injectable({
    providedIn: 'root'
})
export class StudentProgressService {
    private apiUrl = 'http://localhost:8089/api/progress';

    constructor(private http: HttpClient) {}

    // Get all progress entries
    getAllProgress(): Observable<StudentProgress[]> {
        return this.http.get<StudentProgress[]>(this.apiUrl);
    }

    // Get progress by ID
    getProgressById(id: number): Observable<StudentProgress> {
        return this.http.get<StudentProgress>(`${this.apiUrl}/${id}`);
    }

    // Get progress by course ID
    getProgressByCourseId(courseId: number): Observable<StudentProgress[]> {
        return this.http.get<StudentProgress[]>(`${this.apiUrl}/course/${courseId}`);
    }

    // Get progress by lesson ID
    getProgressByLessonId(lessonId: number): Observable<StudentProgress[]> {
        return this.http.get<StudentProgress[]>(`${this.apiUrl}/lesson/${lessonId}`);
    }

    // Get progress by student ID
    getProgressByStudentId(studentId: number): Observable<StudentProgress[]> {
        return this.http.get<StudentProgress[]>(`${this.apiUrl}/student/${studentId}`);
    }

    // Create a new progress entry
    createProgress(courseId: number, lessonId: number, progress: StudentProgress): Observable<StudentProgress> {
        return this.http.post<StudentProgress>(`${this.apiUrl}/course/${courseId}/lesson/${lessonId}`, progress);
    }

    // Update an existing progress entry
    updateProgress(id: number, progress: StudentProgress): Observable<StudentProgress> {
        return this.http.put<StudentProgress>(`${this.apiUrl}/${id}`, progress);
    }

    // Delete a progress entry
    deleteProgress(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    // Update quiz score
    updateQuizScore(id: number, score: number): Observable<StudentProgress> {
        const progress = { score: score, quizCompleted: true };
        return this.http.put<StudentProgress>(`${this.apiUrl}/${id}`, progress);
    }

    // Mark lesson as completed
    markLessonAsCompleted(id: number): Observable<StudentProgress> {
        const progress = { lessonCompleted: true };
        return this.http.put<StudentProgress>(`${this.apiUrl}/${id}`, progress);
    }

    // Mark course as completed
    markCourseAsCompleted(id: number): Observable<StudentProgress> {
        const progress = { courseCompleted: true };
        return this.http.put<StudentProgress>(`${this.apiUrl}/${id}`, progress);
    }
}
