import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./ai.component').then(m => m.AiComponent)
  },
  {
    path: 'predict-duration',
    loadComponent: () => import('./predict-duration/predict-duration.component').then(m => m.PredictDurationComponent)
  },
  {
    path: 'recommend-course',
    loadComponent: () => import('./recommend-course/recommend-course.component').then(m => m.RecommendCourseComponent)
  },
  {
    path: 'competence-recommendations',
    loadComponent: () => import('./competence-recommendations/competence-recommendations.component').then(m => m.CompetenceRecommendationsComponent)
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  providers: []
})
export class AiModule { }
