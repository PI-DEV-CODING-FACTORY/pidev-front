import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inscription } from '../../../models/Inscription';

@Injectable({
  providedIn: 'root'
})
export class InscriptionService {
  private apiUrl = 'http://localhost:8080/inscription';

  constructor(private http: HttpClient) {}

  createInscription(inscription: Inscription, file: File): Observable<Inscription> {
    const formData = new FormData();
    const inscriptionBlob = new Blob([JSON.stringify(inscription)], { type: 'application/json' });
    
    formData.append('inscription', inscriptionBlob);
    formData.append('file', file);

    return this.http.post<Inscription>(`${this.apiUrl}/add`, formData);
}
}