import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InscriptionService {
  // Update this URL to match your Spring Boot backend URL
  private baseUrl = 'http://localhost:8080/api/inscription';

  constructor(private http: HttpClient) { }

  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/upload`, formData);
  }

  addInscription(inscriptionData: any, degreeFile: File | null, notesFile: File | null): Observable<any> {
    const formData = new FormData();
    
    // Append inscription data as a JSON string
    formData.append('inscription', new Blob([JSON.stringify(inscriptionData)], { type: 'application/json' }));
    
    // Append files if they exist
    if (degreeFile) {
      formData.append('degreeFile', degreeFile);
    }
    if (notesFile) {
      formData.append('notesFile', notesFile);
    }

    return this.http.post(`${this.baseUrl}/add`, formData)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 0) {
        errorMessage = 'Le serveur n\'est pas accessible. Veuillez vérifier votre connexion ou contacter l\'administrateur.';
      } else {
        errorMessage = `Code d'erreur: ${error.status}\nMessage: ${error.message}`;
      }
    }
    return throwError(() => errorMessage);
  }
}
