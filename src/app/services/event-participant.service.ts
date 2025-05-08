import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventParticipant } from '../models/event-participant.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventParticipantService {
  private apiUrl = `${environment.apiUrl}/participants`;

  constructor(private http: HttpClient) { }

  getEventParticipants(eventId: number): Observable<EventParticipant[]> {
    return this.http.get<EventParticipant[]>(`${this.apiUrl}/event/${eventId}`);
  }

  getApprovedParticipants(eventId: number): Observable<EventParticipant[]> {
    return this.http.get<EventParticipant[]>(`${this.apiUrl}/event/${eventId}/approved`);
  }

  approveParticipant(participantId: number): Observable<EventParticipant> {
    return this.http.put<EventParticipant>(`${this.apiUrl}/${participantId}/approve`, {});
  }

  rejectParticipant(participantId: number): Observable<EventParticipant> {
    return this.http.put<EventParticipant>(`${this.apiUrl}/${participantId}/reject`, {});
  }
} 