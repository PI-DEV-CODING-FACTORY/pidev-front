import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-ai',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule
  ],
  template: `
    <div class="container mx-auto p-6">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">AI for You</h1>
        <p class="text-lg text-gray-600">Explore our AI-powered tools to enhance your learning experience</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Course Duration Prediction Card -->
        <div class="card shadow-lg rounded-lg overflow-hidden border border-gray-200">
          <div class="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h2 class="text-2xl font-bold text-gray-800 mb-3">Predict Course Duration</h2>
            <p class="text-gray-600 mb-4">Estimate how long it will take you to complete a course based on your learning habits and the course content.</p>
            <button 
              pButton 
              type="button" 
              label="Get Started" 
              icon="pi pi-clock" 
              class="p-button-primary"
              (click)="navigateTo('predict-duration')"
            ></button>
          </div>
        </div>
        
        <!-- Course Recommendation Card -->
        <div class="card shadow-lg rounded-lg overflow-hidden border border-gray-200">
          <div class="p-6 bg-gradient-to-r from-purple-50 to-pink-50">
            <h2 class="text-2xl font-bold text-gray-800 mb-3">Course Recommendations</h2>
            <p class="text-gray-600 mb-4">Get personalized course recommendations based on your interests, skills, and learning goals.</p>
            <button 
              pButton 
              type="button" 
              label="Explore" 
              icon="pi pi-compass" 
              class="p-button-secondary"
              (click)="navigateTo('recommend-course')"
            ></button>
          </div>
        </div>
        
        <!-- Competence-Based Recommendations Card -->
        <div class="card shadow-lg rounded-lg overflow-hidden border border-gray-200">
          <div class="p-6 bg-gradient-to-r from-green-50 to-teal-50">
            <h2 class="text-2xl font-bold text-gray-800 mb-3">Competence-Based Recommendations</h2>
            <p class="text-gray-600 mb-4">Get course recommendations based on your existing competences and skills.</p>
            <button 
              pButton 
              type="button" 
              label="Find Courses" 
              icon="pi pi-list" 
              class="p-button-success"
              (click)="navigateTo('competence-recommendations')"
            ></button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AiComponent {
  constructor(private router: Router) {}
  
  navigateTo(path: string) {
    this.router.navigate(['/ai', path]);
  }
}
