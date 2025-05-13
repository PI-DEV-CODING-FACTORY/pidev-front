import { Routes } from '@angular/router';

export const AI_ROUTES: Routes = [
    { 
        path: '', 
        loadComponent: () => import('./ai.component').then(m => m.AiComponent)
    },
    { 
        path: 'predict-duration', 
        loadComponent: () => import('./predict-duration/predict-duration.component').then(m => m.PredictDurationComponent)
    },
    { 
        path: 'competence-recommendations', 
        loadComponent: () => import('./competence-recommendations/competence-recommendations.component').then(m => m.CompetenceRecommendationsComponent)
    },
    
    
]; 