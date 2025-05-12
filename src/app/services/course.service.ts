import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CourseType, ExampleHistoryType } from '../models/course.model';
import { map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface Recommendation {
    formation: string;
    similarity_score: number;
    competences: string[];
    centre_interet: string;
    duree: number;
    note: number;
  }
  
 export  interface ApiResponse {
    recommendations: Recommendation[];
  }
@Injectable({
    providedIn: 'root'
})

export class CourseService {
    private apiUrl = 'http://localhost:8087/api/courses';
    private recommendationApiUrl = 'http://localhost:8088/recommendations/';

    constructor(private http: HttpClient) {}

    fetchCoursesFromApi() {
        return this.http.get<CourseType[]>(this.apiUrl);
    }

    getCourseById(id: number) {
        return this.http.get<CourseType>(`${this.apiUrl}/${id}`);
    }

    createCourse(courseData: Partial<CourseType>) {
        return this.http.post<CourseType>(this.apiUrl, courseData);
    }

    recommandCourse(top_n: number):Observable<ApiResponse> {
        return this.fetchCoursesFromApi().pipe(
            switchMap(courses => {
                const competences = courses.map(course => course.title);
                const body = {
                    competences: competences,
                    top_n: top_n
                };
                return this.http.post<ApiResponse>(this.recommendationApiUrl, body);
            })
        );
    }
  
}
