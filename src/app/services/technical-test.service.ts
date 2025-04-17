import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TechnicalTest } from '../models/technical-test.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TechnicalTestService {
  private apiUrl = `${environment.apiUrl}/technical-tests`;

  constructor(private http: HttpClient) {}

  getTechnicalTests(): Observable<TechnicalTest[]> {
    return this.http.get<TechnicalTest[]>(this.apiUrl);
  }

  getTechnicalTestById(id: number): Observable<TechnicalTest> {
    return this.http.get<TechnicalTest>(`${this.apiUrl}/${id}`);
  }

  getTechnicalTestsByStudentId(studentId: number): Observable<TechnicalTest[]> {
    return this.http.get<TechnicalTest[]>(`${this.apiUrl}/student/${studentId}`);
  }

  createTechnicalTest(test: Partial<TechnicalTest>): Observable<TechnicalTest> {
    return this.http.post<TechnicalTest>(this.apiUrl, test);
  }

  updateTechnicalTest(id: number, test: Partial<TechnicalTest>): Observable<TechnicalTest> {
    return this.http.put<TechnicalTest>(`${this.apiUrl}/${id}`, test);
  }

  deleteTechnicalTest(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  submitTechnicalTest(id: number, test: TechnicalTest): Observable<TechnicalTest> {
    const submission = {
      technicalTestId: id,
      answers: test.questions.map(q => ({
        questionId: q.id,
        answer: q.isMultipleChoice ? 
          (Array.isArray(q.selectedAnswers) ? q.selectedAnswers.join(',') : '') :
          (q.userAnswer || '')
      })),
      timeSpent: `PT${test.timeSpentSeconds || 0}S`,
      cheated: false
    };

    console.log('Submission payload:', submission); // Debug log to verify the data

    return this.http.post<TechnicalTest>(`${this.apiUrl}/submit`, submission);
  }
} 