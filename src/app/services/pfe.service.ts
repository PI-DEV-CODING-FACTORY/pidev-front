import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pfe } from '../models/pfe.model';

@Injectable({
  providedIn: 'root'
})
export class PfeService {
  private apiUrl = '/api/pfe';

  constructor(private http: HttpClient) { }

  getAllPfes(): Observable<Pfe[]> {
    return this.http.get<Pfe[]>(this.apiUrl);
  }

  getPfeById(id: number): Observable<Pfe> {
    return this.http.get<Pfe>(`${this.apiUrl}/${id}`);
  }

  createPfe(pfe: Pfe): Observable<Pfe> {
    return this.http.post<Pfe>(this.apiUrl, pfe);
  }

  updatePfe(id: number, pfe: Pfe): Observable<Pfe> {
    return this.http.put<Pfe>(`${this.apiUrl}/${id}`, pfe);
  }

  deletePfe(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  uploadPfeReport(id: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(`${this.apiUrl}/${id}/upload-report`, formData);
  }
} 