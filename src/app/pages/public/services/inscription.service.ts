import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inscription } from '../../../models/Inscription';
import { InscriptionRequest } from '../../../models/InscriptionRequest';

@Injectable({
  providedIn: 'root'
})
export class InscriptionService {
  private apiUrl = 'http://localhost:8080/inscription';

  constructor(private http: HttpClient) {}

  createInscription(formData: FormData): Observable<Inscription> {
    return this.http.post<Inscription>(`${this.apiUrl}/add`, formData);
  }

  // createInscription(request: InscriptionRequest): Observable<Inscription> {
  //   const formData = new FormData();
    
  //   // Append all fields exactly as they appear in the working curl command
  //   formData.append('firstName', request.firstName);
  //   formData.append('lastName', request.lastName);
  //   formData.append('personalEmail', request.personalEmail);
  //   formData.append('phoneNumber', request.phoneNumber || '');
  //   formData.append('dateOfBirth', request.dateOfBirth.toISOString().split('T')[0]); // Format as YYYY-MM-DD
  //   formData.append('maritalStatus', request.maritalStatus || '');
  //   formData.append('healthStatus', request.healthStatus || '');
  //   formData.append('address', request.address || '');
  //   formData.append('city', request.city || '');
  //   formData.append('zipCode', request.zipCode?.toString() || '');
  //   formData.append('courseId', request.courseId || '');
    
  //   // Append the file with the correct name
  //   if (request.diplomaDocument) {
  //       formData.append('diplomaDocument', request.diplomaDocument);
  //   }

  //   return this.http.post<Inscription>(`${this.apiUrl}/add`, formData);
  // }
}