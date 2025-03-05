import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PfeService } from '../../../services/pfe.service';
import { Pfe, PfeStatus } from '../../../models/pfe.model';

// PrimeNG Imports
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton';
import { PaginatorModule } from 'primeng/paginator';

// Define OpenFor enum
enum OpenFor {
  INTERNSHIP = 'INTERNSHIP',
  JOB = 'JOB',
  BOTH = 'BOTH'
}

// Extended PFE interface to include additional properties
interface ExtendedPfe extends Pfe {
  githubUrl?: string;
  videoUrl?: string;
  openFor?: OpenFor;
  reportUrl?: string;
}

@Component({
  selector: 'app-pfe-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    TagModule,
    ToastModule,
    ConfirmDialogModule,
    DialogModule,
    CardModule,
    ChipModule,
    TooltipModule,
    SkeletonModule,
    PaginatorModule
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <div class="container mx-auto px-4 py-6">
      <div class="bg-white rounded-xl shadow-lg overflow-hidden">
        <!-- Header -->
        <div class="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 class="text-3xl font-extrabold text-gray-800 tracking-tight">PFE Projects</h1>
              <p class="mt-2 text-lg text-gray-600">Browse and manage all Projet de Fin d'Études</p>
            </div>
            <button 
              pButton 
              type="button" 
              label="Add New PFE" 
              icon="pi pi-plus" 
              class="p-button-primary p-0 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md mt-4 md:mt-0"
              (click)="navigateToAddPfe()"
            ></button>
          </div>
        </div>
        
        <!-- Content -->
        <div class="p-6">
          <!-- Filters -->
          <div class="mb-8 p-5 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-semibold text-gray-800">Filter Projects</h2>
              <button 
                *ngIf="globalFilter || statusFilter || openForFilter"
                pButton 
                type="button" 
                label="Clear All" 
                icon="pi pi-filter-slash" 
                class="p-button-outlined p-button-sm p-button-secondary"
                (click)="clearFilters()"
              ></button>
              <button 
                *ngIf="!globalFilter && !statusFilter && !openForFilter"
                pButton 
                type="button" 
                label="Filters" 
                icon="pi pi-filter" 
                class="p-button-outlined p-button-sm p-button-secondary"
                disabled
              ></button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div class="col-span-1 md:col-span-5">
                <label for="global-search" class="block text-sm font-medium text-gray-600 mb-1">Search</label>
                <div class="relative w-full">
                  <i class="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10"></i>
                  <input 
                    id="global-search"
                    type="text" 
                    pInputText 
                    style="padding-left: 2rem;"
                    placeholder="Search by title, description or technologies" 
                    class="w-full px-8 p-inputtext-md"
                    (input)="applyFilter($event, 'global')"
                  />
                </div>
              </div>
              
              <div class="col-span-1 md:col-span-3">
                <label for="status-filter" class="block text-sm font-medium text-gray-600 mb-1">Status</label>
                <p-dropdown 
                  id="status-filter"
                  [options]="statusOptions" 
                  placeholder="All Statuses" 
                  [showClear]="true"
                  styleClass="w-full"
                  class="w-full" 
                  (onChange)="applyFilter($event, 'status')"
                ></p-dropdown>
              </div>
              
              <div class="col-span-1 md:col-span-3">
                <label for="openfor-filter" class="block text-sm font-medium text-gray-600 mb-1">Open For</label>
                <p-dropdown 
                  id="openfor-filter"
                  [options]="openForOptions" 
                  placeholder="All Types" 
                  [showClear]="true"
                  styleClass="w-full"
                  class="w-full" 
                  (onChange)="applyFilter($event, 'openFor')"
                ></p-dropdown>
              </div>
            </div>
            
            <!-- Active filters display -->
            <div *ngIf="globalFilter || statusFilter || openForFilter" class="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-200">
              <span class="text-sm font-medium text-gray-500 mr-2 self-center">Active filters:</span>
              
              <p-chip *ngIf="globalFilter" 
                [label]="'Search: ' + globalFilter" 
                [removable]="true" 
                (onRemove)="clearGlobalFilter()"
                styleClass="bg-blue-50 text-blue-700"
              ></p-chip>
              
              <p-chip *ngIf="statusFilter" 
                [label]="'Status: ' + statusFilter" 
                [removable]="true" 
                (onRemove)="clearStatusFilter()"
                styleClass="bg-green-50 text-green-700"
              ></p-chip>
              
              <p-chip *ngIf="openForFilter" 
                [label]="'Open For: ' + openForFilter" 
                [removable]="true" 
                (onRemove)="clearOpenForFilter()"
                styleClass="bg-purple-50 text-purple-700"
              ></p-chip>
            </div>
          </div>
          
          <!-- Loading Skeleton -->
          <div *ngIf="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div *ngFor="let _ of [1,2,3,4,5,6]" class="col-span-1">
              <div class="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <div class="p-4">
                  <p-skeleton height="2rem" styleClass="mb-2"></p-skeleton>
                  <p-skeleton height="1rem" width="80%" styleClass="mb-2"></p-skeleton>
                  <p-skeleton height="4rem" styleClass="mb-2"></p-skeleton>
                  <div class="flex gap-2 mb-2">
                    <p-skeleton height="1.5rem" width="25%"></p-skeleton>
                    <p-skeleton height="1.5rem" width="25%"></p-skeleton>
                    <p-skeleton height="1.5rem" width="25%"></p-skeleton>
                  </div>
                  <div class="flex justify-between mt-4">
                    <p-skeleton height="2rem" width="30%"></p-skeleton>
                    <div class="flex gap-2">
                      <p-skeleton shape="circle" size="2rem"></p-skeleton>
                      <p-skeleton shape="circle" size="2rem"></p-skeleton>
                      <p-skeleton shape="circle" size="2rem"></p-skeleton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- PFE Cards Grid -->
          <div *ngIf="!loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Empty state -->
            <div *ngIf="filteredPfes.length === 0" class="col-span-full">
              <div class="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg">
                <i class="pi pi-folder-open text-5xl text-gray-300 mb-3"></i>
                <span class="text-gray-500 text-xl">No PFE projects found</span>
                <p class="text-gray-400 mt-2">Try clearing filters or add a new PFE project</p>
                <button 
                  pButton 
                  type="button" 
                  label="Add New PFE" 
                  icon="pi pi-plus" 
                  class="p-button-primary mt-4"
                  (click)="navigateToAddPfe()"
                ></button>
              </div>
            </div>
            
            <!-- PFE Cards -->
            <div *ngFor="let pfe of displayedPfes" class="col-span-1">
              <div class="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
                <!-- Card Header with Status Badge -->
                <div class="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <p-tag 
                    [value]="pfe.status" 
                    [severity]="getStatusSeverity(pfe.status)"
                  ></p-tag>
                  <span 
                    *ngIf="pfe['openFor']"
                    [ngClass]="{
                      'bg-blue-100 text-blue-800': pfe['openFor'] === 'INTERNSHIP',
                      'bg-purple-100 text-purple-800': pfe['openFor'] === 'JOB',
                      'bg-indigo-100 text-indigo-800': pfe['openFor'] === 'BOTH'
                    }"
                    class="px-2 py-1 rounded-full text-xs font-medium"
                  >
                    {{pfe['openFor']}}
                  </span>
                </div>
                
                <!-- Card Content -->
                <div class="p-4 flex-grow">
                  <h3 class="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">{{pfe.title}}</h3>
                  <p class="text-gray-600 mb-4 line-clamp-3">{{pfe.description}}</p>
                  
                  <!-- Technologies -->
                  <div class="mb-4">
                    <h4 class="text-sm font-medium text-gray-500 mb-2">Technologies</h4>
                    <div class="flex flex-wrap gap-1">
                      <p-chip 
                        *ngFor="let tech of getTechnologiesArray(pfe).slice(0, 3)" 
                        [label]="tech" 
                        styleClass="mr-1 mb-1"
                      ></p-chip>
                      <span 
                        *ngIf="getTechnologiesArray(pfe).length > 3" 
                        class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                      >
                        +{{getTechnologiesArray(pfe).length - 3}} more
                      </span>
                    </div>
                  </div>
                  
                  <!-- GitHub Link if available -->
                  <div *ngIf="pfe.githubUrl" class="mb-4">
                    <a 
                      [href]="pfe.githubUrl" 
                      target="_blank" 
                      class="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                    >
                      <i class="pi pi-github mr-1"></i> View on GitHub
                    </a>
                  </div>
                </div>
                
                <!-- Card Footer with Actions -->
                <div class="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
                  <button 
                    pButton 
                    type="button" 
                    label="View Details" 
                    icon="pi pi-eye" 
                    class="p-button-text p-button-sm"
                    (click)="viewPfeDetails(pfe)"
                  ></button>
                  
                  <div class="flex gap-2">
                    <button 
                      pButton 
                      type="button" 
                      icon="pi pi-pencil" 
                      class="p-button-rounded p-button-text p-button-warning"
                      pTooltip="Edit"
                      (click)="editPfe(pfe)"
                    ></button>
                    <button 
                      pButton 
                      type="button" 
                      icon="pi pi-trash" 
                      class="p-button-rounded p-button-text p-button-danger"
                      pTooltip="Delete"
                      (click)="confirmDelete(pfe)"
                    ></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Pagination -->
          <div *ngIf="!loading && filteredPfes.length > 0" class="flex justify-center mt-8">
            <p-paginator 
              [first]="first"
              [rows]="rows" 
              [totalRecords]="totalRecords" 
              [rowsPerPageOptions]="[6, 9, 12, 15]"
              (onPageChange)="onPageChange($event)"
            ></p-paginator>
          </div>
        </div>
      </div>
    </div>
    
    <!-- PFE Details Dialog -->
    <p-dialog 
      [(visible)]="displayDialog" 
      [modal]="true" 
      [style]="{width: '90vw', maxWidth: '800px'}" 
      [draggable]="false" 
      [resizable]="false"
      styleClass="p-0"
      [closeOnEscape]="true"
      [dismissableMask]="true"
    >
      <ng-template pTemplate="header">
        <div class="text-xl font-bold">PFE Project Details</div>
      </ng-template>
      
      <div *ngIf="selectedPfe" class="p-0">
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-t-lg">
          <h2 class="text-2xl font-bold text-gray-800">{{selectedPfe.title}}</h2>
          <p-tag 
            [value]="selectedPfe.status" 
            [severity]="getStatusSeverity(selectedPfe.status)"
            class="mt-2"
          ></p-tag>
        </div>
        
        <div class="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="col-span-1 md:col-span-2">
            <h3 class="text-lg font-semibold text-gray-700 mb-2">Description</h3>
            <p class="text-gray-600">{{selectedPfe.description}}</p>
          </div>
          
          <div class="col-span-1">
            <h3 class="text-lg font-semibold text-gray-700 mb-2">Technologies</h3>
            <div class="flex flex-wrap gap-1">
              <p-chip *ngFor="let tech of getTechnologiesArray(selectedPfe)" [label]="tech"></p-chip>
            </div>
          </div>
          
          <div class="col-span-1" *ngIf="selectedPfe['openFor']">
            <h3 class="text-lg font-semibold text-gray-700 mb-2">Open For</h3>
            <span 
              [ngClass]="{
                'bg-blue-100 text-blue-800': selectedPfe['openFor'] === 'INTERNSHIP',
                'bg-purple-100 text-purple-800': selectedPfe['openFor'] === 'JOB',
                'bg-indigo-100 text-indigo-800': selectedPfe['openFor'] === 'BOTH'
              }"
              class="px-3 py-1 rounded-full text-sm font-medium"
            >
              {{selectedPfe['openFor']}}
            </span>
          </div>
          
          <div class="col-span-1" *ngIf="selectedPfe['githubUrl']">
            <h3 class="text-lg font-semibold text-gray-700 mb-2">GitHub Repository</h3>
            <a [href]="selectedPfe['githubUrl']" target="_blank" class="text-blue-600 hover:underline flex items-center">
              <i class="pi pi-github mr-2"></i>
              <span>{{selectedPfe['githubUrl']}}</span>
            </a>
          </div>
          
          <div class="col-span-1" *ngIf="selectedPfe['videoUrl']">
            <h3 class="text-lg font-semibold text-gray-700 mb-2">Video Presentation</h3>
            <a [href]="selectedPfe['videoUrl']" target="_blank" class="text-blue-600 hover:underline flex items-center">
              <i class="pi pi-video mr-2"></i>
              <span>Watch Video</span>
            </a>
          </div>
          
          <div class="col-span-1 md:col-span-2" *ngIf="selectedPfe['reportUrl']">
            <h3 class="text-lg font-semibold text-gray-700 mb-2">Project Report</h3>
            <a [href]="selectedPfe['reportUrl']" target="_blank" class="text-blue-600 hover:underline flex items-center">
              <i class="pi pi-file-pdf mr-2"></i>
              <span>Download Report</span>
            </a>
          </div>
          
          <div class="col-span-1">
            <h3 class="text-lg font-semibold text-gray-700 mb-2">Student ID</h3>
            <p class="text-gray-600">{{selectedPfe.studentId}}</p>
          </div>
          
          <div class="col-span-1" *ngIf="selectedPfe.createdAt">
            <h3 class="text-lg font-semibold text-gray-700 mb-2">Created At</h3>
            <p class="text-gray-600">{{selectedPfe.createdAt | date:'medium'}}</p>
          </div>
        </div>
      </div>
      
      <ng-template pTemplate="footer">
        <div class="flex justify-end gap-2">
          <button 
            pButton 
            type="button" 
            label="Close" 
            icon="pi pi-times" 
            class="p-button-outlined"
            (click)="displayDialog = false"
          ></button>
          <button 
            *ngIf="selectedPfe"
            pButton 
            type="button" 
            label="View Full Details" 
            icon="pi pi-external-link" 
            class="p-button-info"
            (click)="navigateToDetails(selectedPfe)"
          ></button>
          <button 
            *ngIf="selectedPfe"
            pButton 
            type="button" 
            label="Edit" 
            icon="pi pi-pencil" 
            class="p-button-primary"
            (click)="editPfe(selectedPfe)"
          ></button>
        </div>
      </ng-template>
    </p-dialog>
    
    <!-- Confirmation Dialog for Delete -->
    <p-confirmDialog 
      header="Confirm Deletion" 
      icon="pi pi-exclamation-triangle" 
      acceptButtonStyleClass="p-button-danger" 
      rejectButtonStyleClass="p-button-text"
      acceptLabel="Yes, delete it"
      rejectLabel="Cancel"
    ></p-confirmDialog>
    
    <!-- Toast for notifications -->
    <p-toast></p-toast>
  `
})
export class PfeListComponent implements OnInit {
  pfes: ExtendedPfe[] = [];
  filteredPfes: ExtendedPfe[] = [];
  displayedPfes: ExtendedPfe[] = [];
  loading: boolean = true;
  selectedPfe: ExtendedPfe | null = null;
  displayDialog: boolean = false;
  totalRecords: number = 0;
  
  // Pagination properties
  first: number = 0;
  rows: number = 9;
  
  // Filters
  globalFilter: string = '';
  statusFilter: string = '';
  openForFilter: string = '';
  
  statusOptions = [
    { label: 'Pending', value: PfeStatus.PENDING },
    { label: 'Approved', value: PfeStatus.APPROVED },
    { label: 'Rejected', value: PfeStatus.REJECTED },
    { label: 'Completed', value: PfeStatus.COMPLETED }
  ];
  
  openForOptions = [
    { label: 'Internship', value: 'INTERNSHIP' },
    { label: 'Job', value: 'JOB' },
    { label: 'Both', value: 'BOTH' }
  ];
  
  constructor(
    private pfeService: PfeService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}
  
  ngOnInit() {
    this.loadPfes();
  }
  
  loadPfes() {
    this.loading = true;
    this.pfeService.getAllPfes().subscribe({
      next: (data) => {
        this.pfes = data as ExtendedPfe[];
        this.filteredPfes = [...this.pfes];
        this.totalRecords = this.filteredPfes.length;
        this.updateDisplayedPfes();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading PFEs:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load PFE projects'
        });
        this.loading = false;
      }
    });
  }
  
  updateDisplayedPfes() {
    this.displayedPfes = this.filteredPfes.slice(this.first, this.first + this.rows);
  }
  
  applyFilter(event: any, filterType: string) {
    if (filterType === 'global') {
      this.globalFilter = event.target.value.toLowerCase();
    } else if (filterType === 'status') {
      this.statusFilter = event.value;
    } else if (filterType === 'openFor') {
      this.openForFilter = event.value;
    }
    
    this.applyFilters();
  }
  
  clearFilters() {
    this.globalFilter = '';
    this.statusFilter = '';
    this.openForFilter = '';
    this.filteredPfes = [...this.pfes];
    this.totalRecords = this.filteredPfes.length;
    this.first = 0;
    this.updateDisplayedPfes();
    
    // Clear UI inputs
    const searchInput = document.querySelector('#global-search') as HTMLInputElement;
    if (searchInput) {
      searchInput.value = '';
    }
    
    // Reset dropdowns
    const statusDropdown = document.querySelector('p-dropdown[id="status-filter"]') as any;
    if (statusDropdown) {
      statusDropdown.clear();
    }
    
    const openForDropdown = document.querySelector('p-dropdown[id="openfor-filter"]') as any;
    if (openForDropdown) {
      openForDropdown.clear();
    }
  }
  
  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.updateDisplayedPfes();
  }
  
  getTechnologiesArray(pfe: Pfe): string[] {
    if (typeof pfe.technologies === 'string') {
      return (pfe.technologies as string).split(',').map((tech: string) => tech.trim());
    }
    return pfe.technologies as string[] || [];
  }
  
  getStatusSeverity(status: PfeStatus): 'success' | 'warn' | 'danger' | 'info' | 'secondary' {
    switch (status) {
      case PfeStatus.PENDING:
        return 'warn';
      case PfeStatus.APPROVED:
        return 'success';
      case PfeStatus.REJECTED:
        return 'danger';
      case PfeStatus.COMPLETED:
        return 'info';
      default:
        return 'secondary';
    }
  }
  
  navigateToAddPfe() {
    this.router.navigate(['/pfe/add']);
  }
  
  viewPfeDetails(pfe: ExtendedPfe) {
    if (!pfe.id) return;
    console.log('Current URL:', window.location.href);
    console.log('Navigating to:', '/pfe', pfe.id);
    this.router.navigate(['/pfe', pfe.id]);
  }
  
  editPfe(pfe: ExtendedPfe) {
    if (!pfe.id) return;
    this.router.navigate(['/pfe/edit', pfe.id]);
  }
  
  confirmDelete(pfe: ExtendedPfe) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the PFE project "${pfe.title}"?`,
      accept: () => {
        this.deletePfe(pfe);
      }
    });
  }
  
  deletePfe(pfe: ExtendedPfe) {
    if (!pfe.id) return;
    
    this.pfeService.deletePfe(pfe.id).subscribe({
      next: () => {
        this.pfes = this.pfes.filter(p => p.id !== pfe.id);
        this.filteredPfes = this.filteredPfes.filter(p => p.id !== pfe.id);
        this.totalRecords = this.filteredPfes.length;
        this.updateDisplayedPfes();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'PFE deleted successfully'
        });
      },
      error: (error) => {
        console.error('Error deleting PFE:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete PFE'
        });
      }
    });
  }

  navigateToDetails(pfe: ExtendedPfe) {
    if (!pfe.id) return;
    console.log('Current URL:', window.location.href);
    console.log('Navigating to:', '/pfe', pfe.id);
    this.displayDialog = false;
    this.router.navigate(['/pfe', pfe.id]);
  }

  clearGlobalFilter() {
    this.globalFilter = '';
    this.applyFilters();
    
    // Clear UI input
    const searchInput = document.querySelector('#global-search') as HTMLInputElement;
    if (searchInput) {
      searchInput.value = '';
    }
  }
  
  clearStatusFilter() {
    this.statusFilter = '';
    this.applyFilters();
    
    // Reset dropdown
    const statusDropdown = document.querySelector('p-dropdown[id="status-filter"]') as any;
    if (statusDropdown) {
      statusDropdown.clear();
    }
  }
  
  clearOpenForFilter() {
    this.openForFilter = '';
    this.applyFilters();
    
    // Reset dropdown
    const openForDropdown = document.querySelector('p-dropdown[id="openfor-filter"]') as any;
    if (openForDropdown) {
      openForDropdown.clear();
    }
  }
  
  applyFilters() {
    this.filteredPfes = this.pfes.filter(pfe => {
      // Apply global filter
      const matchesGlobal = !this.globalFilter || 
        pfe.title.toLowerCase().includes(this.globalFilter) || 
        pfe.description.toLowerCase().includes(this.globalFilter) ||
        this.getTechnologiesArray(pfe).some(tech => tech.toLowerCase().includes(this.globalFilter));
      
      // Apply status filter
      const matchesStatus = !this.statusFilter || pfe.status === this.statusFilter;
      
      // Apply openFor filter
      const matchesOpenFor = !this.openForFilter || pfe.openFor === this.openForFilter;
      
      return matchesGlobal && matchesStatus && matchesOpenFor;
    });
    
    this.totalRecords = this.filteredPfes.length;
    this.first = 0; // Reset to first page when filtering
    this.updateDisplayedPfes();
  }
} 