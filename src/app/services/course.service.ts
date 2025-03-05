import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CourseType } from '../models/course.model';

@Injectable({
    providedIn: 'root'
})
export class CourseService {
    private apiUrl = 'http://localhost:8089/api/courses';

    constructor(private http: HttpClient) {}

    fetchCoursesFromApi() {
        return this.http.get<CourseType[]>(this.apiUrl);
    }

getCourseById(id: number) {
    return this.http.get<CourseType>(`${this.apiUrl}/${id}`);
}
}
