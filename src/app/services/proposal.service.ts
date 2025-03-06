import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Proposal } from '../models/proposal.model';

@Injectable({
  providedIn: 'root'
})
export class ProposalService {
  private apiUrl = '/api/proposals';

  constructor(private http: HttpClient) { }

  getAllProposals(): Observable<Proposal[]> {
    return this.http.get<Proposal[]>(this.apiUrl);
  }

  getProposalById(id: number): Observable<Proposal> {
    return this.http.get<Proposal>(`${this.apiUrl}/${id}`);
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
} 