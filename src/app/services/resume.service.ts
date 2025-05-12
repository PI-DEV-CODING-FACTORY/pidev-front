import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Resume {
    id?: number;
    title: string;
    content: string;
    creationDate?: Date;
    courseId?: number;
}

interface ApiResume {
    id: number;
    title: string;
    content: string;
    creationDate: string;
    // Backend properties
    course: {
        id: number;
        // Other course properties might be here
    };
}

@Injectable({
    providedIn: 'root'
})
export class ResumeService {
    private apiUrl = 'http://localhost:8087/api/resumes';

    constructor(private http: HttpClient) {}

    /**
     * Get all resumes
     */
    getAllResumes(): Observable<ApiResume[]> {
        return this.http.get<ApiResume[]>(this.apiUrl);
    }

    /**
     * Get a resume by its ID
     * @param id Resume ID
     */
    getResumeById(id: number): Observable<ApiResume> {
        return this.http.get<ApiResume>(`${this.apiUrl}/${id}`);
    }

    /**
     * Create a new resume for a specific course
     * @param courseId Course ID
     * @param resume Resume object to create
     */
    createResume(courseId: number, resume: Resume): Observable<ApiResume> {
        return this.http.post<ApiResume>(`${this.apiUrl}/course/${courseId}`, {
            title: resume.title,
            content: resume.content
            // The backend will handle creationDate and course association
        });
    }

    /**
     * Update an existing resume
     * @param id Resume ID
     * @param resume Resume object with updated data
     */
    updateResume(id: number, resume: Partial<Resume>): Observable<ApiResume> {
        return this.http.put<ApiResume>(`${this.apiUrl}/${id}`, {
            title: resume.title,
            content: resume.content
        });
    }

    /**
     * Delete a resume
     * @param id Resume ID
     */
    deleteResume(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    /**
     * Convert API resume format to app resume format
     */
    convertToAppResume(apiResume: ApiResume): Resume {
        return {
            id: apiResume.id,
            title: apiResume.title,
            content: apiResume.content,
            creationDate: new Date(apiResume.creationDate),
            courseId: apiResume.course?.id
        };
    }
}
