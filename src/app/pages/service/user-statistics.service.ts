import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserStatistics {
    id: number;
    username: string;
    totalPosts: number;
    totalAnswers: number;
    bestAnswersCount: number;
    reputation: number;
    technologiesUsed: { technology: string; count: number }[];
    activityByMonth: {
        month: string;
        posts: number;
        answers: number;
    }[];
}

@Injectable({
    providedIn: 'root'
})
export class UserStatisticsService {
    private apiServerUrl = 'http://localhost:8088/post';

    constructor(private http: HttpClient) { }

    getTotalPosts(): Observable<number> {
        return this.http.get<number>(`${this.apiServerUrl}/stats/total-posts`);
    }

    getTotalComments(): Observable<number> {
        return this.http.get<number>(`${this.apiServerUrl}/stats/total-comments`);
    }

    getTotalBestAnswers(): Observable<number> {
        return this.http.get<number>(`${this.apiServerUrl}/stats/total-best-answers`);
    }


    getTopBestAnswerers(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiServerUrl}/stats/top-best-answerers`);
    }

    getTechnologiesDistribution(): Observable<string[]> {
        return this.http.get<string[]>(`${this.apiServerUrl}/find/count/technology`);
    }

    getTopContributors(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiServerUrl}/stats/top-contributors`);
    }
}