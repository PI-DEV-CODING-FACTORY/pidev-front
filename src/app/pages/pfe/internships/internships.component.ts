import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { InternshipService } from '../../../services/internship.service';
import { InternshipOffer } from '../../../models/internship.model';

// PrimeNG Imports
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { CheckboxModule } from 'primeng/checkbox';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-internships',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    MultiSelectModule,
    ToastModule,
    CardModule,
    DividerModule,
    CheckboxModule,
    TagModule
  ],
  providers: [MessageService],
  template: `
    <div class="grid">
      <div class="col-12">
        <div class="card">
          <h5>Internship Opportunities</h5>
          <p>Find the perfect internship opportunity for your career development.</p>
          
          <!-- Search Filters -->
          <div class="grid formgrid p-fluid mb-4">
            <div class="field col-12 md:col-3">
              <span class="p-input-icon-left w-full">
                <i class="pi pi-search"></i>
                <input pInputText type="text" placeholder="Search by keyword" [(ngModel)]="searchFilters.keyword" (input)="onSearch()"/>
              </span>
            </div>
            
            <div class="field col-12 md:col-3">
              <p-dropdown [options]="locations" placeholder="Select Location" [(ngModel)]="searchFilters.location" (onChange)="onSearch()"></p-dropdown>
            </div>
            
            <div class="field col-12 md:col-3">
              <p-multiSelect [options]="technologies" placeholder="Select Technologies" [(ngModel)]="searchFilters.technologies" (onChange)="onSearch()"></p-multiSelect>
            </div>
            
            <div class="field col-12 md:col-3">
              <p-dropdown [options]="durations" placeholder="Duration" [(ngModel)]="searchFilters.duration" (onChange)="onSearch()"></p-dropdown>
            </div>
            
            <div class="field col-12 md:col-3">
              <div class="flex align-items-center">
                <p-checkbox [(ngModel)]="searchFilters.isRemote" [binary]="true" inputId="remote" (onChange)="onSearch()"></p-checkbox>
                <label for="remote" class="ml-2">Remote Only</label>
              </div>
            </div>
            
            <div class="field col-12 md:col-3">
              <button pButton type="button" label="Clear Filters" icon="pi pi-filter-slash" class="p-button-outlined" (click)="clearFilters()"></button>
            </div>
          </div>
          
          <!-- Results Table -->
          <p-table 
            [value]="internships" 
            [paginator]="true" 
            [rows]="10" 
            [rowsPerPageOptions]="[5, 10, 25]"
            [loading]="loading"
            styleClass="p-datatable-gridlines p-datatable-sm"
            [globalFilterFields]="['title', 'company', 'location', 'technologies']"
            responsiveLayout="scroll"
          >
            <ng-template pTemplate="header">
              <tr>
                <th pSortableColumn="title">Title <p-sortIcon field="title"></p-sortIcon></th>
                <th pSortableColumn="company">Company <p-sortIcon field="company"></p-sortIcon></th>
                <th pSortableColumn="location">Location <p-sortIcon field="location"></p-sortIcon></th>
                <th>Technologies</th>
                <th pSortableColumn="duration">Duration <p-sortIcon field="duration"></p-sortIcon></th>
                <th pSortableColumn="startDate">Start Date <p-sortIcon field="startDate"></p-sortIcon></th>
                <th>Remote</th>
                <th>Actions</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-internship>
              <tr>
                <td>{{ internship.title }}</td>
                <td>{{ internship.company }}</td>
                <td>{{ internship.location }}</td>
                <td>
                  <div class="flex flex-wrap gap-1">
                    <p-tag *ngFor="let tech of internship.technologies" [value]="tech" severity="info"></p-tag>
                  </div>
                </td>
                <td>{{ internship.duration }} months</td>
                <td>{{ internship.startDate | date:'mediumDate' }}</td>
                <td>
                  <i class="pi" [ngClass]="{'pi-check-circle text-green-500': internship.isRemote, 'pi-times-circle text-red-500': !internship.isRemote}"></i>
                </td>
                <td>
                  <button pButton type="button" icon="pi pi-eye" class="p-button-rounded p-button-text" (click)="viewDetails(internship)"></button>
                  <button pButton type="button" icon="pi pi-bookmark" class="p-button-rounded p-button-text p-button-success" (click)="saveInternship(internship)"></button>
                </td>
              </tr>
            </ng-template>
            <ng-template pTemplate="emptymessage">
              <tr>
                <td colspan="8" class="text-center p-4">
                  <div *ngIf="loading">Loading internship opportunities...</div>
                  <div *ngIf="!loading">No internship opportunities found matching your criteria.</div>
                </td>
              </tr>
            </ng-template>
          </p-table>
        </div>
      </div>
    </div>
    <p-toast></p-toast>
  `
})
export class InternshipsComponent implements OnInit {
  internships: InternshipOffer[] = [];
  loading: boolean = true;
  
  // Filter options
  locations: any[] = [];
  technologies: any[] = [];
  durations: any[] = [];
  
  searchFilters: any = {
    keyword: '',
    location: null,
    technologies: [],
    duration: null,
    isRemote: false
  };
  
  constructor(
    private internshipService: InternshipService,
    private messageService: MessageService
  ) {}
  
  ngOnInit() {
    this.loadInternships();
    this.initFilterOptions();
  }
  
  loadInternships() {
    this.loading = true;
    this.internshipService.getAllInternships().subscribe({
      next: (data) => {
        this.internships = data;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load internship opportunities'
        });
        this.loading = false;
        console.error('Error loading internships:', error);
      }
    });
  }
  
  initFilterOptions() {
    // These would typically come from an API
    this.locations = [
      { label: 'Tunis', value: 'Tunis' },
      { label: 'Sousse', value: 'Sousse' },
      { label: 'Sfax', value: 'Sfax' },
      { label: 'Ariana', value: 'Ariana' },
      { label: 'Remote', value: 'Remote' }
    ];
    
    this.technologies = [
      { label: 'Angular', value: 'Angular' },
      { label: 'React', value: 'React' },
      { label: 'Vue.js', value: 'Vue.js' },
      { label: 'Node.js', value: 'Node.js' },
      { label: 'Spring Boot', value: 'Spring Boot' },
      { label: 'Django', value: 'Django' },
      { label: 'Flutter', value: 'Flutter' },
      { label: 'AWS', value: 'AWS' },
      { label: 'Docker', value: 'Docker' }
    ];
    
    this.durations = [
      { label: '1-3 months', value: 3 },
      { label: '4-6 months', value: 6 },
      { label: '6+ months', value: 12 }
    ];
  }
  
  onSearch() {
    this.loading = true;
    
    // Prepare search parameters
    const params: any = {};
    
    if (this.searchFilters.keyword) {
      params.keyword = this.searchFilters.keyword;
    }
    
    if (this.searchFilters.location) {
      params.location = this.searchFilters.location;
    }
    
    if (this.searchFilters.technologies && this.searchFilters.technologies.length > 0) {
      params.technologies = this.searchFilters.technologies.join(',');
    }
    
    if (this.searchFilters.duration) {
      params.duration = this.searchFilters.duration;
    }
    
    if (this.searchFilters.isRemote) {
      params.isRemote = true;
    }
    
    this.internshipService.searchInternships(params).subscribe({
      next: (data) => {
        this.internships = data;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to search internship opportunities'
        });
        this.loading = false;
        console.error('Error searching internships:', error);
      }
    });
  }
  
  clearFilters() {
    this.searchFilters = {
      keyword: '',
      location: null,
      technologies: [],
      duration: null,
      isRemote: false
    };
    this.loadInternships();
  }
  
  viewDetails(internship: InternshipOffer) {
    // Navigate to details page or show details in a dialog
    this.messageService.add({
      severity: 'info',
      summary: 'View Details',
      detail: `Viewing details for ${internship.title}`
    });
  }
  
  saveInternship(internship: InternshipOffer) {
    // Save internship to user's saved list
    this.messageService.add({
      severity: 'success',
      summary: 'Saved',
      detail: `${internship.title} has been saved to your list`
    });
  }
} 