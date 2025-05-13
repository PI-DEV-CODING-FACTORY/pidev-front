import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Report {
  id?: number;
  title: string;
  content: string;
  userId: string;
  createdAt?: Date;
  status?: 'PENDING' | 'RESOLVED' | 'REJECTED';
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = 'http://localhost:8081/reports';

  constructor(private http: HttpClient) { }

  submitReport(report: Report): Observable<Report> {
    return this.http.post<Report>(`${this.apiUrl}/submit`, report);
  }

  getAllReports(): Observable<Report[]> {
    return this.http.get<Report[]>(`${this.apiUrl}/all`);
  }

  getUserReports(userId: string): Observable<Report[]> {
    return this.http.get<Report[]>(`${this.apiUrl}/user/${userId}`);
  }

  updateReportStatus(reportId: number, status: 'PENDING' | 'RESOLVED' | 'REJECTED'): Observable<Report> {
    return this.http.put<Report>(`${this.apiUrl}/${reportId}/status`, { status });
  }
}
