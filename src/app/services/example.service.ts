import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ExampleType } from '../models/example.model';
import { ExampleHistoryType } from '../models/course.model';

@Injectable({
    providedIn: 'root'
})
export class ExampleService {
    private apiUrl = 'http://localhost:8089/api/example-histories';

    constructor(private http: HttpClient) {}

    fetchExamplesFromApi() {
        return this.http.get<ExampleType[]>(this.apiUrl);
    }

    getExampleById(id: number) {
        return this.http.get<ExampleType>(`${this.apiUrl}/${id}`);
    }

    getExamplesByCourseId(courseId: number) {
        return this.http.get<ExampleType[]>(`${this.apiUrl}/course/${courseId}`);
    }
    getExampleHistories(courseId: number, lessonId: number) {
        return this.http.get<ExampleHistoryType[]>(`${this.apiUrl}/course/${courseId}/lesson/${lessonId}`);
    }
}
