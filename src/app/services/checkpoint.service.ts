import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Checkpoint } from '../models/checkpoint.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CheckpointService {
  private apiUrl = `${environment.apiUrl}/Checkpoints`;

  constructor(private http: HttpClient) { }

  getCheckpointsByEventId(eventId: number): Observable<Checkpoint[]> {
    console.log(this.apiUrl);
    return this.http.get<Checkpoint[]>(`${this.apiUrl}/${eventId}`);
  }

  getTeamCheckpoints(teamId: number): Observable<Checkpoint[]> {
    return this.http.get<Checkpoint[]>(`${this.apiUrl}/team/${teamId}`);
  }

  addCheckpoint(checkpoint: Checkpoint): Observable<Checkpoint> {
    return this.http.post<Checkpoint>(`${this.apiUrl}/add`, checkpoint);
  }

  // ✅ Update checkpoint
  updateCheckpoint(id: number, updatedCheckpoint: Checkpoint): Observable<Checkpoint> {
    return this.http.put<Checkpoint>(`${this.apiUrl}/${id}`, updatedCheckpoint);
  }

  // ✅ Delete checkpoint
  deleteCheckpoint(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
