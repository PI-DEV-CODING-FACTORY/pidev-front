import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
    diplomaDocument: any | null;
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
    private apiUrl = 'http://localhost:8083/inscription/all';

    constructor(private http: HttpClient) {}

    getInscriptions(): Observable<Inscription[]> {
        return this.http.get<Inscription[]>(this.apiUrl);
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