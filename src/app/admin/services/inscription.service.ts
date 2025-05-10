import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Inscription {
    id: string;
    firstName: string;
    lastName: string;
    personalEmail: string | null;
    phoneNumber: string | null;
    dateOfBirth: string | null;
    maritalStatus: string | null;
    address: string | null;
    city: string | null;
    zipCode: number | null;
    diplomaDocument: string | null;
    diplomaDocumentType: string;
    diplomaDocumentName: string;
    courseId: string | null;
    status: string;
    healthStatus: string | null;
}

@Injectable({
    providedIn: 'root'
})
export class InscriptionService {
    private apiUrl = 'http://localhost:8080/inscription';

    constructor(private http: HttpClient) {}

    getInscriptions(): Observable<Inscription[]> {
        return this.http.get<Inscription[]>(`${this.apiUrl}/all`);
    }

    getDocument(id: string): Observable<Blob> {
        return this.http.get(`${this.apiUrl}/${id}/document`, { responseType: 'blob' });
    }

    approveInscription(id: string): Observable<string> {
        return this.http.put(`${this.apiUrl}/${id}/approve`, {}, { responseType: 'text' });
    }

    rejectIncription(id:string):Observable<string>{
        return this.http.put(`${this.apiUrl}/${id}/reject`, {}, { responseType: 'text' });
    }
}