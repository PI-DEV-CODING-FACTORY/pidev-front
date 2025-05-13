import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipsModule } from 'primeng/chips';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { SkeletonModule } from 'primeng/skeleton';

interface Category {
  name: string;
  value: string;
}

interface LearningGoal {
  name: string;
  value: string;
}

interface CourseRecommendation {
  id: number;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: string;
  rating: number;
  relevanceScore: number;
  imageUrl: string;
  tags: string[];
}

@Component({
  selector: 'app-recommend-course',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    DropdownModule,
    CheckboxModule,
    ChipsModule,
    ToastModule,
    TagModule,
    RatingModule,
    SkeletonModule
  ],
  providers: [MessageService],
  template: `
    <div class="container mx-auto p-6">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Course Recommendations</h1>
        <p class="text-lg text-gray-600">Get personalized course recommendations based on your interests and goals</p>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-1">
          <div class="card shadow-lg rounded-lg overflow-hidden border border-gray-200 p-6 sticky top-6">
            <h2 class="text-xl font-bold text-gray-800 mb-4">Your Preferences</h2>
            
            <form [formGroup]="preferencesForm" (ngSubmit)="getRecommendations()">
              <div class="field mb-4">
                <label for="categories" class="block text-sm font-medium text-gray-700 mb-1">Interested Categories</label>
                <p-dropdown
                  id="categories"
                  [options]="categories"
                  formControlName="category"
                  placeholder="Select Category"
                  optionLabel="name"
                  [style]="{'width':'100%'}"
                ></p-dropdown>
              </div>
              
              <div class="field mb-4">
                <label for="learningGoal" class="block text-sm font-medium text-gray-700 mb-1">Learning Goal</label>
                <p-dropdown
                  id="learningGoal"
                  [options]="learningGoals"
                  formControlName="learningGoal"
                  placeholder="Select Goal"
                  optionLabel="name"
                  [style]="{'width':'100%'}"
                ></p-dropdown>
              </div>
              
              <div class="field mb-4">
                <label for="skills" class="block text-sm font-medium text-gray-700 mb-1">Your Skills</label>
                <p-chips
                  id="skills"
                  formControlName="skills"
                  placeholder="Add skills and press enter"
                  [style]="{'width':'100%'}"
                ></p-chips>
                <small class="text-gray-500">Add skills you already have</small>
              </div>
              
              <div class="field mb-4">
                <label for="interests" class="block text-sm font-medium text-gray-700 mb-1">Your Interests</label>
                <p-chips
                  id="interests"
                  formControlName="interests"
                  placeholder="Add interests and press enter"
                  [style]="{'width':'100%'}"
                ></p-chips>
                <small class="text-gray-500">Add topics you're interested in</small>
              </div>
              
              <div class="field-checkbox mb-4">
                <p-checkbox formControlName="includeProjects" [binary]="true" inputId="includeProjects"></p-checkbox>
                <label for="includeProjects" class="ml-2">Include project-based courses</label>
              </div>
              
              <div class="field-checkbox mb-4">
                <p-checkbox formControlName="includeCertifications" [binary]="true" inputId="includeCertifications"></p-checkbox>
                <label for="includeCertifications" class="ml-2">Include certification courses</label>
              </div>
              
              <button 
                pButton 
                type="submit" 
                label="Get Recommendations" 
                icon="pi pi-search" 
                class="p-button-primary w-full"
                [loading]="loading"
              ></button>
            </form>
          </div>
        </div>
        
        <div class="lg:col-span-2">
          <div *ngIf="loading" class="grid grid-cols-1 gap-6">
            <div *ngFor="let i of [1,2,3]" class="card shadow-lg rounded-lg overflow-hidden border border-gray-200 p-6">
              <div class="flex flex-col">
                <p-skeleton height="2rem" width="70%" styleClass="mb-2"></p-skeleton>
                <p-skeleton height="1rem" width="40%" styleClass="mb-4"></p-skeleton>
                <p-skeleton height="4rem" styleClass="mb-4"></p-skeleton>
                <div class="flex justify-between">
                  <p-skeleton height="2rem" width="30%"></p-skeleton>
                  <p-skeleton height="2rem" width="20%"></p-skeleton>
                </div>
              </div>
            </div>
          </div>
          
          <div *ngIf="!loading && recommendations.length === 0 && !firstLoad" class="flex flex-col items-center justify-center p-8">
            <i class="pi pi-search text-5xl text-gray-400 mb-4"></i>
            <h3 class="text-xl font-semibold text-gray-700 mb-2">No Recommendations Found</h3>
            <p class="text-gray-500 text-center">Try adjusting your preferences to get more course recommendations</p>
          </div>
          
          <div *ngIf="firstLoad && !loading" class="flex flex-col items-center justify-center p-8">
            <i class="pi pi-compass text-5xl text-gray-400 mb-4"></i>
            <h3 class="text-xl font-semibold text-gray-700 mb-2">Ready to Find Your Next Course?</h3>
            <p class="text-gray-500 text-center">Fill out your preferences and click "Get Recommendations" to discover courses tailored for you</p>
          </div>
          
          <div *ngIf="!loading && recommendations.length > 0" class="grid grid-cols-1 gap-6">
            <div *ngFor="let course of recommendations" class="card shadow-lg rounded-lg overflow-hidden border border-gray-200">
              <div class="p-6">
                <div class="flex justify-between items-start mb-3">
                  <h3 class="text-xl font-bold text-gray-800">{{course.title}}</h3>
                  <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">{{course.relevanceScore}}% Match</span>
                </div>
                
                <p class="text-gray-600 mb-4">{{course.description}}</p>
                
                <div class="flex flex-wrap gap-2 mb-4">
                  <p-tag *ngFor="let tag of course.tags" [value]="tag" [rounded]="true"></p-tag>
                </div>
                
                <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <span class="block text-sm font-medium text-gray-500">Category</span>
                    <span class="text-gray-800">{{course.category}}</span>
                  </div>
                  <div>
                    <span class="block text-sm font-medium text-gray-500">Level</span>
                    <span class="text-gray-800">{{course.level}}</span>
                  </div>
                  <div>
                    <span class="block text-sm font-medium text-gray-500">Duration</span>
                    <span class="text-gray-800">{{course.duration}}</span>
                  </div>
                </div>
                
                <div class="flex justify-between items-center">
                  <div class="flex items-center">
                    <span class="mr-2">Rating:</span>
                    <p-rating [ngModel]="course.rating" [readonly]="true" [cancel]="false"></p-rating>
                  </div>
                  
                  <button 
                    pButton 
                    type="button" 
                    label="View Course" 
                    icon="pi pi-external-link" 
                    class="p-button-outlined"
                  ></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <p-toast></p-toast>
  `
})
export class RecommendCourseComponent implements OnInit {
  preferencesForm: FormGroup;
  loading = false;
  firstLoad = true;
  recommendations: CourseRecommendation[] = [];
  
  categories: Category[] = [
    { name: 'Web Development', value: 'web-dev' },
    { name: 'Mobile Development', value: 'mobile-dev' },
    { name: 'Data Science', value: 'data-science' },
    { name: 'Machine Learning', value: 'machine-learning' },
    { name: 'DevOps', value: 'devops' },
    { name: 'Cloud Computing', value: 'cloud' },
    { name: 'Cybersecurity', value: 'security' },
    { name: 'UI/UX Design', value: 'ui-ux' },
    { name: 'Game Development', value: 'game-dev' }
  ];
  
  learningGoals: LearningGoal[] = [
    { name: 'Career Advancement', value: 'career' },
    { name: 'New Skills Acquisition', value: 'skills' },
    { name: 'Academic Requirements', value: 'academic' },
    { name: 'Personal Interest', value: 'personal' },
    { name: 'Professional Certification', value: 'certification' }
  ];
  
  // Sample course data for demonstration
  sampleCourses: CourseRecommendation[] = [
    {
      id: 1,
      title: 'Modern Web Development with React',
      description: 'Learn to build modern, responsive web applications using React, Redux, and related technologies.',
      category: 'Web Development',
      level: 'Intermediate',
      duration: '8 weeks',
      rating: 4.5,
      relevanceScore: 95,
      imageUrl: 'assets/images/courses/react.jpg',
      tags: ['React', 'JavaScript', 'Redux', 'Frontend']
    },
    {
      id: 2,
      title: 'Data Science Fundamentals with Python',
      description: 'Master the basics of data science using Python, pandas, NumPy, and visualization libraries.',
      category: 'Data Science',
      level: 'Beginner',
      duration: '10 weeks',
      rating: 4.7,
      relevanceScore: 92,
      imageUrl: 'assets/images/courses/data-science.jpg',
      tags: ['Python', 'Data Analysis', 'Visualization', 'Statistics']
    },
    {
      id: 3,
      title: 'Full-Stack JavaScript Development',
      description: 'Comprehensive course covering both frontend and backend development with JavaScript.',
      category: 'Web Development',
      level: 'Intermediate',
      duration: '12 weeks',
      rating: 4.6,
      relevanceScore: 88,
      imageUrl: 'assets/images/courses/fullstack.jpg',
      tags: ['JavaScript', 'Node.js', 'Express', 'MongoDB', 'Full-Stack']
    },
    {
      id: 4,
      title: 'Machine Learning Engineering',
      description: 'Learn to build and deploy machine learning models for real-world applications.',
      category: 'Machine Learning',
      level: 'Advanced',
      duration: '14 weeks',
      rating: 4.8,
      relevanceScore: 85,
      imageUrl: 'assets/images/courses/ml.jpg',
      tags: ['Python', 'TensorFlow', 'Scikit-learn', 'Deep Learning']
    },
    {
      id: 5,
      title: 'Mobile App Development with Flutter',
      description: 'Build cross-platform mobile applications for iOS and Android using Flutter and Dart.',
      category: 'Mobile Development',
      level: 'Intermediate',
      duration: '8 weeks',
      rating: 4.4,
      relevanceScore: 82,
      imageUrl: 'assets/images/courses/flutter.jpg',
      tags: ['Flutter', 'Dart', 'Mobile', 'Cross-Platform']
    }
  ];
  
  constructor(
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.preferencesForm = this.fb.group({
      category: ['', Validators.required],
      learningGoal: ['', Validators.required],
      skills: [[]],
      interests: [[]],
      includeProjects: [true],
      includeCertifications: [false]
    });
  }
  
  ngOnInit() {
    // Any initialization logic
  }
  
  getRecommendations() {
    if (this.preferencesForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please select at least a category and learning goal'
      });
      return;
    }
    
    this.loading = true;
    this.firstLoad = false;
    
    // Simulate API call with timeout
    setTimeout(() => {
      const formValues = this.preferencesForm.value;
      
      // Filter courses based on form inputs
      // In a real application, this would be a backend API call
      this.recommendations = this.filterCourses(formValues);
      
      this.loading = false;
      
      if (this.recommendations.length > 0) {
        this.messageService.add({
          severity: 'success',
          summary: 'Recommendations Ready',
          detail: `Found ${this.recommendations.length} courses that match your preferences`
        });
      } else {
        this.messageService.add({
          severity: 'info',
          summary: 'No Matches Found',
          detail: 'Try adjusting your preferences to get more recommendations'
        });
      }
    }, 1500);
  }
  
  filterCourses(preferences: any): CourseRecommendation[] {
    // This is a simplified filtering algorithm
    // In a real application, you would use a more sophisticated recommendation engine
    
    let filtered = [...this.sampleCourses];
    
    // Filter by category if selected
    if (preferences.category) {
      const categoryName = this.categories.find(c => c.value === preferences.category.value)?.name;
      filtered = filtered.filter(course => 
        course.category === categoryName || 
        course.tags.some(tag => tag.toLowerCase().includes(preferences.category.value))
      );
    }
    
    // Adjust relevance scores based on interests match
    if (preferences.interests && preferences.interests.length > 0) {
      filtered.forEach(course => {
        const interestMatches = preferences.interests.filter((interest: string) => 
          course.tags.some(tag => tag.toLowerCase().includes(interest.toLowerCase())) ||
          course.title.toLowerCase().includes(interest.toLowerCase()) ||
          course.description.toLowerCase().includes(interest.toLowerCase())
        ).length;
        
        if (interestMatches > 0) {
          // Boost relevance score based on interest matches
          course.relevanceScore += Math.min(interestMatches * 3, 10);
        }
      });
    }
    
    // Adjust relevance scores based on skills match
    if (preferences.skills && preferences.skills.length > 0) {
      filtered.forEach(course => {
        const skillMatches = preferences.skills.filter((skill: string) => 
          course.tags.some(tag => tag.toLowerCase().includes(skill.toLowerCase()))
        ).length;
        
        if (skillMatches > 0) {
          // Slightly reduce relevance score for courses that match existing skills
          // (assuming user wants to learn new skills)
          course.relevanceScore -= Math.min(skillMatches * 2, 5);
        }
      });
    }
    
    // Filter by project-based courses if selected
    if (!preferences.includeProjects) {
      filtered = filtered.filter(course => 
        !course.tags.some(tag => tag.toLowerCase().includes('project'))
      );
    }
    
    // Filter by certification courses if selected
    if (preferences.includeCertifications) {
      // Boost relevance score for certification courses
      filtered.forEach(course => {
        if (course.tags.some(tag => tag.toLowerCase().includes('certification'))) {
          course.relevanceScore += 5;
        }
      });
    }
    
    // Sort by relevance score (descending)
    filtered.sort((a, b) => b.relevanceScore - a.relevanceScore);
    
    // Cap relevance score at 100
    filtered.forEach(course => {
      course.relevanceScore = Math.min(course.relevanceScore, 100);
    });
    
    return filtered;
  }
}
