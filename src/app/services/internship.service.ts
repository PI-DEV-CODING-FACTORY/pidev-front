import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InternshipOffer } from '../models/internship.model';

@Injectable({
  providedIn: 'root'
})
export class InternshipService {
  private apiUrl = '/api/internship-offers';

  constructor(private http: HttpClient) { }

  getAllInternships(): Observable<InternshipOffer[]> {
    return this.http.get<InternshipOffer[]>(this.apiUrl);
  }

  getInternshipById(id: number): Observable<InternshipOffer> {
    return this.http.get<InternshipOffer>(`${this.apiUrl}/${id}`);
  }

  createInternship(internship: InternshipOffer): Observable<InternshipOffer> {
    return this.http.post<InternshipOffer>(this.apiUrl, internship);
  }

  updateInternship(id: number, internship: InternshipOffer): Observable<InternshipOffer> {
    return this.http.put<InternshipOffer>(`${this.apiUrl}/${id}`, internship);
  }

  deleteInternship(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchInternships(params: any): Observable<InternshipOffer[]> {
    return this.http.get<InternshipOffer[]>(`${this.apiUrl}/search`, { params });
  }
} 