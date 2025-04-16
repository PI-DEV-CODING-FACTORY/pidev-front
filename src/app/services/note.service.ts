import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Note } from '../pages/course/components/note-panel.component';

interface ApiNote {
    id: number;
    content: string;
    color: string;
    timestamp: string;
    // Backend properties returned from API
    courseId: number;
    lessonId: number;
}

@Injectable({
    providedIn: 'root'
})
export class NoteService {
    private apiUrl = 'http://localhost:8089/api/notes';

    constructor(private http: HttpClient) {}

    /**
     * Get all notes
     */
    getAllNotes(): Observable<ApiNote[]> {
        return this.http.get<ApiNote[]>(this.apiUrl);
    }

    /**
     * Get a note by its ID
     * @param id Note ID
     */
    getNoteById(id: number): Observable<ApiNote> {
        return this.http.get<ApiNote>(`${this.apiUrl}/${id}`);
    }

    /**
     * Get all notes for a specific lesson
     * @param lessonId Lesson ID
     */
    getNotesByLessonId(lessonId: number): Observable<ApiNote[]> {
        return this.http.get<ApiNote[]>(`${this.apiUrl}/lesson/${lessonId}`);
    }

    /**
     * Get all notes for a specific course
     * @param courseId Course ID
     */
    getNotesByCourseId(courseId: number): Observable<ApiNote[]> {
        return this.http.get<ApiNote[]>(`${this.apiUrl}/course/${courseId}`);
    }

    /**
     * Get all notes for a specific course and lesson
     * @param courseId Course ID
     * @param lessonId Lesson ID
     */
    getNotesByCourseAndLessonId(courseId: number, lessonId: number): Observable<ApiNote[]> {
        return this.http.get<ApiNote[]>(`${this.apiUrl}/course/${courseId}/lesson/${lessonId}`);
    }

    /**
     * Create a new note for a specific course and lesson
     * @param courseId Course ID
     * @param lessonId Lesson ID
     * @param note Note object to create
     */
    createNote(courseId: number, lessonId: number, note: Note): Observable<ApiNote> {
        return this.http.post<ApiNote>(`${this.apiUrl}/course/${courseId}/lesson/${lessonId}`, {
            content: note.content,
            color: note.color
            // The backend will handle timestamp, courseId, and lessonId
        });
    }

    /**
     * Update an existing note
     * @param note Note object with updated data
     */
    updateNote(id: number, note: Partial<Note>): Observable<ApiNote> {
        return this.http.put<ApiNote>(`${this.apiUrl}/${id}`, {
            content: note.content,
            color: note.color
        });
    }

    /**
     * Delete a note
     * @param id Note ID
     */
    deleteNote(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    /**
     * Convert API note format to app note format
     */
    convertToAppNote(apiNote: ApiNote): Note {
        return {
            lessonId: apiNote.lessonId,
            courseId: apiNote.courseId,
            content: apiNote.content,
            timestamp: new Date(apiNote.timestamp),
            color: apiNote.color
        };
    }
}
