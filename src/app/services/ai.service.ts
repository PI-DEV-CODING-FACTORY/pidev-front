import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Checkpoint } from '@app/models/checkpoint.model';

@Injectable({
  providedIn: 'root'
})
export class AIService {
  private apiUrl = `${environment.apiUrl}/Checkpoints`;

  constructor(private http: HttpClient) { }

  generateCheckpoints(projectDescription: string): Observable<any> {
    return this.http.get<{ summary: string; checkpoints: Checkpoint[] }>(
      `http://localhost:8089/api/Checkpoints/ask?prompt=${encodeURIComponent(projectDescription)}`
    )
  }
} 