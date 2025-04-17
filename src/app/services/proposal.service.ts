import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Proposal, ProposalStatus } from '../models/proposal.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProposalService {
  private apiUrl = `${environment.apiUrl}/proposals`;

  constructor(private http: HttpClient) { }

  getAllProposals(): Observable<Proposal[]> {
    return this.http.get<Proposal[]>(this.apiUrl);
  }

  getProposalById(id: number): Observable<Proposal> {
    return this.http.get<Proposal>(`${this.apiUrl}/${id}`);
  }

  getProposalsByStudentId(studentId: number): Observable<Proposal[]> {
    return this.http.get<Proposal[]>(`${this.apiUrl}/student/${studentId}`);
  }

  createProposal(proposal: Proposal): Observable<Proposal> {
    return this.http.post<Proposal>(this.apiUrl, proposal);
  }

  updateProposal(id: number, proposal: Proposal): Observable<Proposal> {
    return this.http.put<Proposal>(`${this.apiUrl}/${id}`, proposal);
  }

  deleteProposal(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchProposals(params: any): Observable<Proposal[]> {
    return this.http.get<Proposal[]>(`${this.apiUrl}/search`, { params });
  }

  acceptProposal(id: number): Observable<any> {
    const url = `http://localhost:8089/api/proposals/${id}/accept-proposal`;
    console.log('Accept proposal URL:', url);
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': '*/*'
    });
    
    // Use responseType: 'text' to handle empty responses
    return this.http.post(url, {}, { 
      headers, 
      responseType: 'text',
      observe: 'response'
    }).pipe(
      map(response => {
        console.log('Response status:', response.status);
        console.log('Response body:', response.body);
        // If the response is successful but empty, return a success object
        if (response.status === 200) {
          return { success: true, message: 'Proposal accepted successfully' };
        }
        // If there's actual content, try to parse it
        if (response.body) {
          try {
            return JSON.parse(response.body);
          } catch (e) {
            return { success: true, message: 'Proposal accepted successfully', rawResponse: response.body };
          }
        }
        return { success: true };
      }),
      catchError(error => {
        console.error('Error in acceptProposal:', error);
        throw error;
      })
    );
  }

  declineProposal(id: number): Observable<any> {
    const url = `http://localhost:8089/api/proposals/${id}/decline-proposal`;
    console.log('Decline proposal URL:', url);
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': '*/*'
    });
    
    // Use responseType: 'text' to handle empty responses
    return this.http.post(url, {}, { 
      headers, 
      responseType: 'text',
      observe: 'response'
    }).pipe(
      map(response => {
        console.log('Response status:', response.status);
        console.log('Response body:', response.body);
        // If the response is successful but empty, return a success object
        if (response.status === 200) {
          return { success: true, message: 'Proposal declined successfully' };
        }
        // If there's actual content, try to parse it
        if (response.body) {
          try {
            return JSON.parse(response.body);
          } catch (e) {
            return { success: true, message: 'Proposal declined successfully', rawResponse: response.body };
          }
        }
        return { success: true };
      }),
      catchError(error => {
        console.error('Error in declineProposal:', error);
        throw error;
      })
    );
  }

  // New methods for additional proposal statuses
  scheduleMeeting(id: number, meetingDetails: string, meetingDateTime: string): Observable<any> {
    const url = `${this.apiUrl}/${id}/send-interview-invitation`;
    
    const payload = {
      studentEmail: "achrafsekri2001@gmail.com", // This should come from the student data in a real app
      interviewDateTime: meetingDateTime,
      message: meetingDetails
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': '*/*',
      'X-Company-Id': '1' // This should come from the logged-in company in a real app
    });

    return this.http.post(url, payload, { 
      headers,
      responseType: 'text',
      observe: 'response'
    }).pipe(
      map(response => {
        if (response.status === 200) {
          return { success: true, message: 'Interview invitation sent successfully' };
        }
        if (response.body) {
          try {
            return JSON.parse(response.body);
          } catch (e) {
            return { success: true, message: 'Interview invitation sent successfully', rawResponse: response.body };
          }
        }
        return { success: true };
      }),
      catchError(error => {
        console.error('Error sending interview invitation:', error);
        throw error;
      })
    );
  }
  
  updateProposalStatus(id: number, status: ProposalStatus): Observable<any> {
    // This endpoint would need to be implemented on the backend
    const url = `${this.apiUrl}/${id}/status`;
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': '*/*'
    });
    
    return this.http.post(url, { status }, { 
      headers, 
      responseType: 'text',
      observe: 'response'
    }).pipe(
      map(response => {
        if (response.status === 200) {
          return { success: true, message: `Proposal status updated to ${status}` };
        }
        if (response.body) {
          try {
            return JSON.parse(response.body);
          } catch (e) {
            return { success: true, message: `Proposal status updated to ${status}`, rawResponse: response.body };
          }
        }
        return { success: true };
      }),
      catchError(error => {
        console.error(`Error updating proposal status to ${status}:`, error);
        throw error;
      })
    );
  }
  
  getProposalsByCompanyId(companyId: string): Observable<Proposal[]> {
    return this.http.get<Proposal[]>(`${this.apiUrl}/company/${companyId}`);
  }
} 