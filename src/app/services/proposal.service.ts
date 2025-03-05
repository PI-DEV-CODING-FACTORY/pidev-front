import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  updateProposalStatus(id: number, status: ProposalStatus): Observable<Proposal> {
    return this.http.patch<Proposal>(`${this.apiUrl}/${id}/status`, { status });
  }
} 