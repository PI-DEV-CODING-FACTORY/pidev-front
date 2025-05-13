import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PredictionPayload {
  'Âge': number; // 16-100
  'Niveau_Éducation': string; // 'Bac', 'Bac+2', 'Bac+3', 'Bac+5', 'Doctorat'
  'Note_Moyenne_Antérieure': number; // 0-20
  'Heures_Étude_Par_Semaine': number; // 1-80
  'Expérience_Formation': number; // 0-50 years
  'Difficulté_Formation': string; // 'Facile', 'Moyen', 'Difficile'
  'Durée_Formation_Prévue': number; // 1-156 weeks
  'Durée_Formation_Réelle': number; // Required by the API
}

export interface PredictionResponse {
  success: boolean;
  prediction: {
    duree_semaines: number;
    duree_mois: number;
    intervalle_confiance: {
      minimum: number;
      maximum: number;
      niveau_confiance: number;
    }
  };
  message: string;
  details: {
    precision: string;
    recommandation: string;
  };
}

export interface CompetencePayload {
  competences: string[];
  top_n?: number;
}

export interface CourseRecommendationResponse {
  recommendations: {
    formation: string;
    similarity_score: number;
    competences: string[];
    centre_interet: string;
    duree: number;
    note: number;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private apiUrl = 'http://127.0.0.1:5544';
  private recommendationUrl = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) { }

  predictCourseDuration(payload: PredictionPayload): Observable<PredictionResponse> {
    return this.http.post<PredictionResponse>(`${this.apiUrl}/predict`, payload);
  }

  getRecommendations(payload: CompetencePayload): Observable<CourseRecommendationResponse> {
    return this.http.post<CourseRecommendationResponse>(`${this.recommendationUrl}/recommendations/`, payload);
  }
}
