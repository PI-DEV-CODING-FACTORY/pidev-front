import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Inscription {
  id: string;
  firstName: string;
  lastName: string;
  personalEmail: string;
  phoneNumber: string;
  dateOfBirth: string;
  maritalStatus: string;
  address: string;
  city: string;
  zipCode: number;
  diplomaDocument: string[];
  diplomaDocumentType: string;
  diplomaDocumentName: string;
  courseId: string;
  status: string;
  createdAt: string;
  healthStatus: string;
}

@Injectable({
  providedIn: 'root'
})
export class InscriptionService {
  private apiUrl = '/inscription/all';

  constructor(private http: HttpClient) { }

  getAllInscriptions(): Observable<Inscription[]> {
    return this.http.get<Inscription[]>(this.apiUrl);
  }

  deleteInscription(id: string): Observable<any> {
    return this.http.delete(`/inscription/${id}`);
  }

  updateInscriptionStatus(id: string, status: string): Observable<any> {
    return this.http.patch(`/inscription/${id}/status`, { status });
  }
}
