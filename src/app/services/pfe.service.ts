import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pfe } from '../models/pfe.model';
import { SavedPfe } from '../models/saved-pfe.model';

@Injectable({
  providedIn: 'root'
})
export class PfeService {
  private apiUrl = 'http://localhost:8089/api/pfe';
  private savedPfesUrl = 'http://localhost:8089/api/saved-pfes';

  constructor(private http: HttpClient) { }

  getAllPfes(): Observable<Pfe[]> {
    return this.http.get<Pfe[]>(this.apiUrl);
  }

  getPfeById(id: number): Observable<Pfe> {
    return this.http.get<Pfe>(`${this.apiUrl}/${id}`);
  }

  createPfe(pfe: Pfe): Observable<Pfe> {
    pfe.studentId = 1;
    return this.http.post<Pfe>(this.apiUrl, pfe);
  }

  createPfeWithFile(formData: FormData): Observable<Pfe> {
    return this.http.post<Pfe>(this.apiUrl, formData);
  }

  updatePfe(id: number, pfe: Pfe): Observable<Pfe> {
    return this.http.put<Pfe>(`${this.apiUrl}/${id}`, pfe);
  }

  deletePfe(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  uploadPfeReport(id: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('rapport', file);
    return this.http.post<any>(`${this.apiUrl}/${id}/rapport`, formData);
  }

  // Save PFE to company's saved list
  savePfeToCompany(pfeId: number): Observable<any> {
    const headers = {
      'X-Company-Id': '1' // TODO: Get this from auth service or user context
    };
    return this.http.post(`${this.savedPfesUrl}/${pfeId}`, {}, { headers });
  }

  // Check if PFE is saved by company
  isPfeSaved(pfeId: number): Observable<{isSaved: boolean}> {
    const headers = {
      'X-Company-Id': '1' // TODO: Get this from auth service or user context
    };
    return this.http.get<{isSaved: boolean}>(`${this.savedPfesUrl}/${pfeId}/is-saved`, { headers });
  }

  // Unsave PFE from company's saved list
  unsavePfe(pfeId: number): Observable<any> {
    const headers = {
      'X-Company-Id': '1' // TODO: Get this from auth service or user context
    };
    return this.http.delete(`${this.savedPfesUrl}/${pfeId}`, { headers });
  }

  // Get all saved PFEs for a company
  getSavedPfes(): Observable<SavedPfe[]> {
    const headers = {
      'X-Company-Id': '1' // TODO: Get this from auth service or user context
    };
    return this.http.get<SavedPfe[]>(`${this.savedPfesUrl}`, { headers });
  }
} 