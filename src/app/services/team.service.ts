import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Team } from '../models/team.model';
import { Checkpoint } from '../models/checkpoint.model';
import { Participant } from '../models/participant.model';
import { environment } from '../../environments/environment';
import { EventParticipant } from '@app/models/event-participant.model';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private apiUrl = `http://localhost:8089/api/Team`;

  constructor(private http: HttpClient) { }

  getTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(this.apiUrl);
  }

  getTeamsByEvent(eventId: number): Observable<Team[]> {
    return this.http.get<Team[]>(`${this.apiUrl}/${eventId}`);
  }

  getTeamById(id: number): Observable<Team> {
    return this.http.get<Team>(`${this.apiUrl}/${id}`);
  }

  createTeam(team: Team): Observable<Team> {
    return this.http.post<Team>(`${this.apiUrl}/add`, team);
  }

  updateTeam(id: number, team: Team): Observable<Team> {
    return this.http.put<Team>(`${this.apiUrl}/${id}`, team);
  }

  deleteTeam(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  assignParticipants(teamId: number, participantIds: number[]): Observable<Team> {
    return this.http.put<Team>(`http://localhost:8089/examen/${participantIds[0]}/affect/${teamId}`,null);
  }

  getParticipantsByEvent(idEvent: number): Observable<EventParticipant[]> {
    return this.http.get<EventParticipant[]>(`${this.apiUrl}/${idEvent}/teams`);
  }

  submitTeamEvaluation(data: any[]): Observable<any> {
    return this.http.post(`http://localhost:8089/api/evaluations`, data);
  }
  

  // Checkpoint methods
  addCheckpoint(teamId: number, checkpoint: Checkpoint): Observable<Checkpoint> {
    return this.http.post<Checkpoint>(`${this.apiUrl}/${teamId}/checkpoints`, checkpoint);
  }

  updateCheckpoint(teamId: number, checkpoint: Checkpoint): Observable<Checkpoint> {
    return this.http.put<Checkpoint>(`${this.apiUrl}/${teamId}/checkpoints/${checkpoint.id}`, checkpoint);
  }

  // Participant methods
  addParticipant(teamId: number, participantId: number): Observable<Team> {
    return this.http.post<Team>(`${this.apiUrl}/${teamId}/participants/${participantId}`, {});
  }

  removeParticipant(teamId: number, participantId: number): Observable<Team> {
    return this.http.delete<Team>(`${this.apiUrl}/${teamId}/participants/${participantId}`);
  }

  // Progress calculation
  calculateTeamProgress(team: Team): number {
    if (!team.checkpoints || team.checkpoints.length === 0) {
      return 0;
    }
    
    const totalPercentage = team.checkpoints.reduce((sum, checkpoint) => {
      return sum + (checkpoint.status === 'COMPLETED' ? checkpoint.percentage : 0);
    }, 0);
    
    return totalPercentage;
  }
} 