import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TechnicalTestService } from '../../services/technical-test.service';
import { TechnicalTest } from '../../models/technical-test.model';

// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProgressBarModule } from 'primeng/progressbar';
import { SkeletonModule } from 'primeng/skeleton';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { DividerModule } from 'primeng/divider';
import { BadgeModule } from 'primeng/badge';

@Component({
  selector: 'app-technical-tests',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    TagModule,
    ChipModule,
    ToastModule,
    ProgressBarModule,
    SkeletonModule,
    InputTextModule,
    DropdownModule,
    DividerModule,
    BadgeModule
  ],
  providers: [MessageService],
  template: `
    <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <!-- Header Section -->
        <div class="mb-8">
          <h2 class="text-3xl font-bold text-gray-900 mb-2">Technical Tests</h2>
          <p class="text-gray-600">View and take technical tests assigned to you</p>
        </div>
        
        <!-- Search and Filter Section -->
        <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div class="md:col-span-6">
              <div class="p-input-icon-left w-full relative">
                <i class="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input 
                  type="text" 
                  pInputText 
                  placeholder="Search by title or technology" 
                  [(ngModel)]="searchText" 
                  (input)="applyFilters()"
                  class="w-full"
                  style="padding-left: 2rem;"
                />
              </div>
            </div>
            
            <div class="md:col-span-4">
              <p-dropdown 
                [options]="statusOptions" 
                placeholder="Filter by Status" 
                [(ngModel)]="selectedStatus" 
                (onChange)="applyFilters()"
                [showClear]="true"
                styleClass="w-full"
              ></p-dropdown>
            </div>
            
            <div class="md:col-span-2">
              <button 
                pButton 
                type="button" 
                label="Clear" 
                icon="pi pi-filter-slash" 
                class="p-button-outlined p-button-secondary w-full"
                (click)="clearFilters()"
                [disabled]="!searchText && !selectedStatus"
              ></button>
            </div>
          </div>
        </div>
        
        <!-- Loading Skeleton -->
        <div *ngIf="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div *ngFor="let _ of [1,2,3,4,5,6]" class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex justify-between items-center mb-4">
              <p-skeleton height="2rem" width="40%"></p-skeleton>
              <p-skeleton height="2rem" width="25%"></p-skeleton>
            </div>
            <p-skeleton height="1.5rem" styleClass="mb-4"></p-skeleton>
            <p-skeleton height="1.5rem" styleClass="mb-4 w-3/4"></p-skeleton>
            <div class="flex gap-3 mb-4">
              <p-skeleton height="2rem" width="30%"></p-skeleton>
              <p-skeleton height="2rem" width="30%"></p-skeleton>
            </div>
            <div class="mt-4">
              <p-skeleton height="2.5rem"></p-skeleton>
            </div>
          </div>
        </div>
        
        <!-- No Tests Message -->
        <div *ngIf="!loading && filteredTests.length === 0" 
             class="bg-white rounded-lg shadow-sm p-12 text-center">
          <i class="pi pi-file-excel text-7xl text-gray-300 mb-4"></i>
          <h3 class="text-2xl font-semibold text-gray-800 mb-2">No technical tests found</h3>
          <p class="text-gray-600">There are no technical tests matching your criteria</p>
        </div>
        
        <!-- Technical Test List -->
        <div *ngIf="!loading && filteredTests.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div *ngFor="let test of filteredTests" 
               class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <div class="p-6">
              <!-- Status Section -->
              <div class="flex items-center justify-between mb-4">
                <span class="inline-flex px-4 py-2 rounded-full text-sm font-medium" 
                      [ngClass]="{
                        'bg-yellow-100 text-yellow-800': !test.isCompleted,
                        'bg-green-100 text-green-800': test.isCompleted
                      }">
                  {{ test.isCompleted ? 'Completed' : 'Pending' }}
                </span>
                <div class="flex items-center text-gray-600">
                  <i class="pi pi-clock mr-2"></i>
                  <span class="text-sm">{{ getDaysRemaining(test.deadline) }}</span>
                </div>
              </div>
              
              <!-- Content Section -->
              <div>
                <h3 class="text-xl font-bold text-gray-900 mb-3 line-clamp-1">{{ test.title }}</h3>
                
                <p class="text-gray-600 mb-4 line-clamp-2">{{ test.description }}</p>
                
                <div class="flex flex-wrap gap-2 mb-4">
                  <span *ngFor="let tech of test.technologies"
                        class="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
                    {{ tech }}
                  </span>
                </div>
                
                <div class="flex flex-col space-y-4">
                  <div class="flex items-center gap-4 text-sm text-gray-500">
                    <span class="flex items-center">
                      <i class="pi pi-calendar mr-2"></i>
                      {{ test.createdAt | date:'mediumDate' }}
                    </span>
                    <span class="flex items-center">
                      <i class="pi pi-question-circle mr-2"></i>
                      {{ test.questions.length }} questions
                    </span>
                  </div>
                  
                  <button 
                    pButton 
                    type="button" 
                    [label]="test.isCompleted ? 'View Results' : 'Take Test'" 
                    [icon]="test.isCompleted ? 'pi pi-eye' : 'pi pi-file-edit'"
                    [class]="test.isCompleted ? 
                      'p-button-outlined w-full' : 
                      'p-button-primary w-full'"
                    (click)="navigateToTest(test.id)"
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
export class TechnicalTestsComponent implements OnInit {
  tests: TechnicalTest[] = [];
  filteredTests: TechnicalTest[] = [];
  loading: boolean = true;
  
  // Filters
  searchText: string = '';
  selectedStatus: string | null = null;
  
  // Filter options
  statusOptions = [
    { label: 'Completed', value: 'completed' },
    { label: 'Pending', value: 'pending' }
  ];
  
  constructor(
    private technicalTestService: TechnicalTestService,
    private messageService: MessageService,
    private router: Router
  ) {}
  
  ngOnInit() {
    this.loadTechnicalTests();
  }
  
  loadTechnicalTests() {
    this.loading = true;
    
    // For now, we'll use a hardcoded student ID (1)
    // In a real application, this would come from an auth service
    this.technicalTestService.getTechnicalTestsByStudentId(1).subscribe({
      next: (data) => {
        this.tests = data;
        this.filteredTests = [...this.tests];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading technical tests:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load technical tests'
        });
        this.loading = false;
      }
    });
  }
  
  applyFilters() {
    this.filteredTests = this.tests.filter(test => {
      // Search text filter
      const matchesSearch = !this.searchText || 
        test.title.toLowerCase().includes(this.searchText.toLowerCase()) ||
        (test.description ? test.description.toLowerCase().includes(this.searchText.toLowerCase()) : false) ||
        test.technologies.some(tech => tech.toLowerCase().includes(this.searchText.toLowerCase()));
      
      // Status filter
      const matchesStatus = !this.selectedStatus || 
        (this.selectedStatus === 'completed' && test.isCompleted) ||
        (this.selectedStatus === 'pending' && !test.isCompleted);
      
      return matchesSearch && matchesStatus;
    });
  }
  
  clearFilters() {
    this.searchText = '';
    this.selectedStatus = null;
    this.filteredTests = [...this.tests];
  }
  
  clearSearchText() {
    this.searchText = '';
    this.applyFilters();
  }
  
  navigateToTest(id: number) {
    this.router.navigate(['/technical-tests', id]);
  }
  
  getDaysRemaining(deadline: string): string {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    
    // Set hours, minutes, seconds, and milliseconds to 0 for accurate day calculation
    today.setHours(0, 0, 0, 0);
    
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return 'Expired';
    } else if (diffDays === 0) {
      return 'Due today';
    } else if (diffDays === 1) {
      return '1 day left';
    } else {
      return `${diffDays} days left`;
    }
  }
  
  getScoreColorClass(score: number): string {
    if (score >= 80) {
      return 'bg-green-500';
    } else if (score >= 60) {
      return 'bg-blue-500';
    } else if (score >= 40) {
      return 'bg-orange-500';
    } else {
      return 'bg-red-500';
    }
  }
  
  getScoreLabel(score: number): string {
    if (score >= 90) {
      return 'Excellent';
    } else if (score >= 80) {
      return 'Very Good';
    } else if (score >= 70) {
      return 'Good';
    } else if (score >= 60) {
      return 'Satisfactory';
    } else if (score >= 40) {
      return 'Needs Improvement';
    } else {
      return 'Poor';
    }
  }
} 