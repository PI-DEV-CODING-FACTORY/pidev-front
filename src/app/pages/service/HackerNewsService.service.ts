import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class HackerNewsService {
    private apiUrl = 'http://localhost:8088/news'; // Adresse de votre backend Spring Boot

    constructor(private http: HttpClient) { }

    // Récupérer les IDs des articles populaires
    getTopStories(): Observable<number[]> {
        return this.http.get<number[]>(`${this.apiUrl}/api/top-stories`);
    }

    // Récupérer les détails d'un article
    getArticleDetails(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/api/article/${id}`);
    }
}
