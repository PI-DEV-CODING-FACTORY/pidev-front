import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { SkeletonModule } from 'primeng/skeleton';
import { DividerModule } from 'primeng/divider';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AiService, CompetencePayload, CourseRecommendationResponse } from '../../../services/ai.service';

interface Competence {
  name: string;
  code: string;
}

@Component({
  selector: 'app-competence-recommendations',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    MultiSelectModule,
    ToastModule,
    TagModule,
    RatingModule,
    SkeletonModule,
    DividerModule,
    ProgressSpinnerModule
  ],
  providers: [MessageService],
  template: `
    <div class="container p-4 mx-auto">
      <p-toast></p-toast>
      
      <div class="mb-6">
        <h1 class="mb-2 text-3xl font-bold text-gray-800">Course Recommendations</h1>
        <p class="text-lg text-gray-600">Get personalized course recommendations based on your competences</p>
      </div>
      
      <div class="p-4 mb-6 card">
        <form [formGroup]="recommendationForm" (ngSubmit)="getRecommendations()">
          <div class="grid grid-cols-1 gap-4 md:grid-cols-12">
            <div class="col-span-1 md:col-span-8">
              <label for="competences" class="block mb-1 text-sm font-medium text-gray-700">
                Select Your Competences (max 4)
              </label>
              <p-multiSelect
                id="competences"
                [options]="availableCompetences"
                formControlName="competences"
                optionLabel="name"
                [maxSelectedLabels]="4"
                [selectionLimit]="4"
                placeholder="Select up to 4 competences"
                [style]="{'width':'100%', 'height':'40px'}"
                display="chip"
              ></p-multiSelect>
              <small class="block mt-1 text-gray-500">Select the competences you already have</small>
            </div>
            
            <div class="col-span-1 md:col-span-2">
              <label for="topN" class="block mb-1 text-sm font-medium text-gray-700">
                Number of Recommendations
              </label>
              <input 
                pInputText 
                type="number" 
                id="topN" 
                formControlName="topN" 
                placeholder="5" 
                class="w-full"
                style="height: 40px;"
                min="1"
                max="10"
              />
            </div>
            
            <div class="flex col-span-1 items-end md:col-span-2">
              <button 
                pButton 
                type="submit" 
                label="Get Recommendations" 
                icon="pi pi-search" 
                [loading]="loading"
                [disabled]="recommendationForm.invalid"
                class="w-full"
                style="height: 40px;"
              ></button>
            </div>
          </div>
        </form>
      </div>
      
      <div *ngIf="loading" class="flex justify-center my-8">
        <p-progressSpinner styleClass="w-8rem h-8rem" strokeWidth="4" fill="var(--surface-ground)" animationDuration=".5s"></p-progressSpinner>
      </div>
      
      <div *ngIf="!loading && recommendations.length > 0" class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div *ngFor="let course of recommendations" class="card border-round shadow-4 hover:shadow-6 transition-duration-300">
          <div class="p-0">
            <!-- Header with match score -->
            <div class="flex p-3 justify-content-between align-items-center" [ngClass]="getHeaderClass(course.similarity_score)">
              <h2 class="m-0 text-xl font-bold text-white">{{ course.formation }}</h2>
              <p-tag 
                [value]="formatScore(course.similarity_score)" 
                severity="info"
                [style]="{background: 'rgba(255,255,255,0.2)', color: 'white'}"
              ></p-tag>
            </div>
            
            <!-- Content -->
            <div class="p-4">
              <!-- Competences with tags -->
              <div class="mb-4">
                <h3 class="mb-2 font-semibold text-gray-700 text-md">Competences</h3>
                <div class="flex flex-wrap gap-2">
                  <p-tag *ngFor="let comp of course.competences" 
                    [value]="comp" 
                    [style]="{background: '#f0f4f8', color: '#334e68'}"
                  ></p-tag>
                </div>
              </div>
              
              <!-- Interest Area -->
              <div class="p-3 mb-4 bg-gray-50 rounded-lg">
                <div class="flex align-items-center">
                  <i class="mr-2 text-blue-500 pi pi-compass"></i>
                  <span class="font-semibold text-gray-700">Interest Area: </span>
                  <span class="ml-2 text-gray-800">{{ course.centre_interet }}</span>
                </div>
              </div>
              
              <!-- Duration and Rating -->
              <div class="grid grid-cols-2 gap-4 mt-4">
                <div class="flex p-3 bg-gray-50 rounded-lg align-items-center">
                  <i class="mr-2 text-blue-500 pi pi-calendar"></i>
                  <div>
                    <div class="font-semibold text-gray-700">Duration</div>
                    <div class="text-gray-800">{{ course.duree }} weeks</div>
                  </div>
                </div>
                <div class="p-3 bg-gray-50 rounded-lg">
                  <div class="mb-1 font-semibold text-gray-700">Rating</div>
                  <div class="flex align-items-center">
                    <p-rating [ngModel]="course.note" [readonly]="true" [cancel]="false" [style]="{'font-size': '1rem'}"></p-rating>
                    <span class="ml-2 text-gray-800">({{ course.note }})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div *ngIf="!loading && recommendations.length === 0 && submitted" class="p-4 text-center card">
        <i class="mb-3 text-5xl text-blue-500 pi pi-info-circle"></i>
        <h3 class="text-xl font-semibold">No recommendations found</h3>
        <p class="text-gray-600">Try selecting different competences or adjusting your preferences.</p>
      </div>
    </div>
  `
})
export class CompetenceRecommendationsComponent implements OnInit {
  recommendationForm: FormGroup;
  loading = false;
  submitted = false;
  recommendations: any[] = [];
  
  availableCompetences: Competence[] = [
    { name: 'C++', code: 'C++' },
    { name: 'Game Development', code: 'Game Development' },
    { name: 'Unity', code: 'Unity' },
    { name: 'Rust', code: 'Rust' },
    { name: 'Operating System', code: 'Operating System' },
    { name: 'System Programming', code: 'System Programming' },
    { name: 'Swift', code: 'Swift' },
    { name: 'iOS Development', code: 'iOS Development' },
    { name: 'Machine Learning', code: 'Machine Learning' },
    { name: 'PHP', code: 'PHP' },
    { name: 'Web Development', code: 'Web Development' },
    { name: 'MySQL', code: 'MySQL' },
    { name: 'Go', code: 'Go' },
    { name: 'Cloud Computing', code: 'Cloud Computing' },
    { name: 'Kubernetes', code: 'Kubernetes' },
    { name: 'TypeScript', code: 'TypeScript' },
    { name: 'Angular', code: 'Angular' },
    { name: 'Fullstack Development', code: 'Fullstack Development' },
    { name: 'MATLAB', code: 'MATLAB' },
    { name: 'Data Science', code: 'Data Science' },
    { name: 'Kotlin', code: 'Kotlin' },
    { name: 'Android Development', code: 'Android Development' },
    { name: 'Mobile App Development', code: 'Mobile App Development' },
    { name: 'Scala', code: 'Scala' },
    { name: 'Big Data', code: 'Big Data' },
    { name: 'Hadoop', code: 'Hadoop' },
    { name: 'R', code: 'R' },
    { name: 'Data Analysis', code: 'Data Analysis' },
    { name: 'Statistics', code: 'Statistics' },
    { name: 'Java', code: 'Java' },
    { name: 'Spring Boot', code: 'Spring Boot' },
    { name: 'Microservices', code: 'Microservices' },
    { name: 'C#', code: 'C#' },
    { name: '.NET Development', code: '.NET Development' },
    { name: 'Ruby', code: 'Ruby' },
    { name: 'Ruby on Rails', code: 'Ruby on Rails' },
    { name: 'AWS', code: 'AWS' },
    { name: 'Serverless', code: 'Serverless' },
    { name: 'Haskell', code: 'Haskell' },
    { name: 'Functional Programming', code: 'Functional Programming' },
    { name: 'Type Theory', code: 'Type Theory' },
    { name: 'JavaScript', code: 'JavaScript' },
    { name: 'React', code: 'React' },
    { name: 'Node.js', code: 'Node.js' },
    { name: 'Julia', code: 'Julia' },
    { name: 'Deep Learning', code: 'Deep Learning' },
    { name: 'Signal Processing', code: 'Signal Processing' },
    { name: 'Image Processing', code: 'Image Processing' },
    { name: 'Laravel', code: 'Laravel' },
    { name: 'Perl', code: 'Perl' },
    { name: 'Network Security', code: 'Network Security' },
    { name: 'Cryptography', code: 'Cryptography' },
    { name: 'Python', code: 'Python' },
    { name: 'SQL', code: 'SQL' },
    { name: 'Power BI', code: 'Power BI' },
    { name: 'AR/VR', code: 'AR/VR' },
    { name: 'Xcode', code: 'Xcode' },
    { name: 'Agile Development', code: 'Agile Development' },
    { name: 'System Administration', code: 'System Administration' },
    { name: 'DevOps', code: 'DevOps' },
    { name: 'Docker', code: 'Docker' },
    { name: 'CI/CD', code: 'CI/CD' },
    { name: 'Git', code: 'Git' },
    { name: 'Blockchain', code: 'Blockchain' },
    { name: 'Smart Contracts', code: 'Smart Contracts' },
    { name: 'Cybersecurity', code: 'Cybersecurity' },
    { name: 'Penetration Testing', code: 'Penetration Testing' },
    { name: 'Ethical Hacking', code: 'Ethical Hacking' },
    { name: 'Natural Language Processing', code: 'Natural Language Processing' },
    { name: 'Computer Vision', code: 'Computer Vision' },
    { name: 'Reinforcement Learning', code: 'Reinforcement Learning' },
    { name: 'Quantum Computing', code: 'Quantum Computing' },
    { name: 'IoT Development', code: 'IoT Development' },
    { name: 'Embedded Systems', code: 'Embedded Systems' },
    { name: 'Robotics', code: 'Robotics' },
    { name: 'API Development', code: 'API Development' },
    { name: 'GraphQL', code: 'GraphQL' },
    { name: 'REST API', code: 'REST API' },
    { name: 'Database Design', code: 'Database Design' },
    { name: 'NoSQL', code: 'NoSQL' },
    { name: 'MongoDB', code: 'MongoDB' },
    { name: 'PostgreSQL', code: 'PostgreSQL' },
    { name: 'Oracle', code: 'Oracle' },
    { name: 'UI/UX Design', code: 'UI/UX Design' },
    { name: 'Frontend Development', code: 'Frontend Development' },
    { name: 'Backend Development', code: 'Backend Development' },
    { name: 'Responsive Design', code: 'Responsive Design' },
    { name: 'SEO Optimization', code: 'SEO Optimization' },
    { name: 'Performance Optimization', code: 'Performance Optimization' },
    { name: 'Parallel Computing', code: 'Parallel Computing' },
    { name: 'High-Performance Computing', code: 'High-Performance Computing' },
    { name: 'Distributed Systems', code: 'Distributed Systems' },
    { name: 'Networking', code: 'Networking' },
    { name: 'Virtualization', code: 'Virtualization' },
    { name: 'Cloud Security', code: 'Cloud Security' },
    { name: 'Data Visualization', code: 'Data Visualization' },
    { name: 'Business Intelligence', code: 'Business Intelligence' },
    { name: 'Project Management', code: 'Project Management' },
    { name: 'Scrum', code: 'Scrum' },
    { name: 'Test-Driven Development', code: 'Test-Driven Development' }
  ];

  constructor(
    private fb: FormBuilder,
    private aiService: AiService,
    private messageService: MessageService
  ) {
    this.recommendationForm = this.fb.group({
      competences: [[], [Validators.required, Validators.maxLength(4)]],
      topN: [5, [Validators.min(1), Validators.max(10)]]
    });
  }

  ngOnInit(): void {
    // Any initialization logic
  }

  getRecommendations(): void {
    if (this.recommendationForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please select at least one competence'
      });
      return;
    }

    this.loading = true;
    this.submitted = true;
    
    const formValues = this.recommendationForm.value;
    const payload: CompetencePayload = {
      competences: formValues.competences.map((comp: Competence) => comp.name),
      top_n: formValues.topN
    };

    this.aiService.getRecommendations(payload).subscribe({
      next: (response: CourseRecommendationResponse) => {
        this.recommendations = response.recommendations;
        this.loading = false;
        
        if (this.recommendations.length > 0) {
          this.messageService.add({
            severity: 'success',
            summary: 'Recommendations Ready',
            detail: `Found ${this.recommendations.length} courses that match your competences`
          });
        } else {
          this.messageService.add({
            severity: 'info',
            summary: 'No Matches Found',
            detail: 'Try selecting different competences'
          });
        }
      },
      error: (error) => {
        console.error('Error fetching recommendations:', error);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to fetch recommendations. Please try again later.'
        });
      }
    });
  }

  formatScore(score: number): string {
    return `${Math.round(score * 100)}% Match`;
  }

  getScoreSeverity(score: number): string {
    if (score >= 0.7) return 'success';
    if (score >= 0.4) return 'warning';
    return 'danger';
  }
  
  getHeaderClass(score: number): string {
    if (score >= 0.7) return 'bg-gradient-to-r from-green-600 to-teal-600';
    if (score >= 0.5) return 'bg-gradient-to-r from-blue-600 to-indigo-600';
    if (score >= 0.3) return 'bg-gradient-to-r from-orange-600 to-amber-600';
    return 'bg-gradient-to-r from-red-600 to-pink-600';
  }
}
