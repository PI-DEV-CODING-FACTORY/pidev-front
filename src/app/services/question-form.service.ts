import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QuestionForm } from '../models/questionform.model';

@Injectable({
  providedIn: 'root'
})
export class QuestionFormService {
  private apiUrl = 'http://localhost:8089/api/question-forms'; // Adjust to your API URL

  constructor(private http: HttpClient) { }

  createQuestionForm(eventId: number, questions: string[]): Observable<QuestionForm> {
    return this.http.post<QuestionForm>(`${this.apiUrl}/events/${eventId}`, questions);
  }

  getQuestionFormByEvent(eventId: number): Observable<QuestionForm> {
    return this.http.get<QuestionForm>(`${this.apiUrl}/events/${eventId}`);
  }
}