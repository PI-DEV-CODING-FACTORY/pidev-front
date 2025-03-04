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
    SkeletonModule
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
          <div class="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="col-span-1">
              <span class="p-input-icon-left w-full">
                <i class="pi pi-search"></i>
                <input 
                  type="text" 
                  pInputText 
                  placeholder="Search by title or description" 
                  class="w-full p-3 rounded-lg border border-gray-300"
                  (input)="applyFilter($event, 'global')"
                />
              </span>
            </div>
            
            <div class="col-span-1">
              <p-dropdown 
                [options]="statusOptions" 
                placeholder="Filter by Status" 
                [showClear]="true"
                class="w-full" 
                (onChange)="applyFilter($event, 'status')"
              ></p-dropdown>
            </div>
            
            <div class="col-span-1">
              <p-dropdown 
                [options]="openForOptions" 
                placeholder="Filter by Open For" 
                [showClear]="true"
                class="w-full" 
                (onChange)="applyFilter($event, 'openFor')"
              ></p-dropdown>
            </div>
            
            <div class="col-span-1">
              <button 
                pButton 
                type="button" 
                label="Clear Filters" 
                icon="pi pi-filter-slash" 
                class="p-button-outlined p-0 px-4 py-2.5 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 rounded-md w-full"
                (click)="clearFilters()"
              ></button>
            </div>
          </div>
          
          <!-- Table -->
          <p-table 
            #dt 
            [value]="pfes" 
            [rows]="10" 
            [paginator]="true" 
            [globalFilterFields]="['title', 'description', 'technologies']"
            [rowHover]="true"
            [showCurrentPageReport]="true"
            [rowsPerPageOptions]="[5, 10, 25, 50]"
            [loading]="loading"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            [filterDelay]="0"
            styleClass="p-datatable-lg"
          >
            <ng-template pTemplate="header">
              <tr class="bg-gray-50">
                <th pSortableColumn="title" class="text-left p-4">
                  Title <p-sortIcon field="title"></p-sortIcon>
                </th>
                <th pSortableColumn="technologies" class="text-left p-4">
                  Technologies <p-sortIcon field="technologies"></p-sortIcon>
                </th>
                <th pSortableColumn="openFor" class="text-left p-4">
                  Open For <p-sortIcon field="openFor"></p-sortIcon>
                </th>
                <th pSortableColumn="status" class="text-left p-4">
                  Status <p-sortIcon field="status"></p-sortIcon>
                </th>
                <th class="text-center p-4">Actions</th>
              </tr>
            </ng-template>
            
            <ng-template pTemplate="body" let-pfe>
              <tr class="border-b border-gray-200">
                <td class="p-4">
                  <div class="font-medium text-gray-900">{{pfe.title}}</div>
                  <div class="text-sm text-gray-500 mt-1 line-clamp-2">{{pfe.description}}</div>
                </td>
                <td class="p-4">
                  <div class="flex flex-wrap gap-1">
                    <p-chip *ngFor="let tech of getTechnologiesArray(pfe)" [label]="tech" styleClass="mr-1 mb-1"></p-chip>
                  </div>
                </td>
                <td class="p-4">
                  <ng-container *ngIf="pfe['openFor']">
                    <span 
                      [ngClass]="{
                        'bg-blue-100 text-blue-800': pfe['openFor'] === 'INTERNSHIP',
                        'bg-purple-100 text-purple-800': pfe['openFor'] === 'JOB',
                        'bg-indigo-100 text-indigo-800': pfe['openFor'] === 'BOTH'
                      }"
                      class="px-2 py-1 rounded-full text-xs font-medium"
                    >
                      {{pfe['openFor']}}
                    </span>
                  </ng-container>
                </td>
                <td class="p-4">
                  <p-tag 
                    [value]="pfe.status" 
                    [severity]="getStatusSeverity(pfe.status)"
                  ></p-tag>
                </td>
                <td class="p-4">
                  <div class="flex justify-center gap-2">
                    <button 
                      pButton 
                      type="button" 
                      icon="pi pi-eye" 
                      class="p-button-rounded p-button-text p-button-info"
                      pTooltip="View Details"
                      (click)="viewPfeDetails(pfe)"
                    ></button>
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
                </td>
              </tr>
            </ng-template>
            
            <ng-template pTemplate="emptymessage">
              <tr>
                <td colspan="5" class="text-center p-6">
                  <div class="flex flex-col items-center">
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
                </td>
              </tr>
            </ng-template>
            
            <ng-template pTemplate="loadingbody">
              <tr *ngFor="let _ of [1,2,3,4,5]">
                <td class="p-4">
                  <p-skeleton height="2rem" styleClass="mb-2"></p-skeleton>
                  <p-skeleton height="1rem" width="80%"></p-skeleton>
                </td>
                <td class="p-4">
                  <div class="flex gap-1">
                    <p-skeleton height="1.5rem" width="4rem" styleClass="mr-1"></p-skeleton>
                    <p-skeleton height="1.5rem" width="4rem"></p-skeleton>
                  </div>
                </td>
                <td class="p-4">
                  <p-skeleton height="1.5rem" width="6rem"></p-skeleton>
                </td>
                <td class="p-4">
                  <p-skeleton height="1.5rem" width="5rem"></p-skeleton>
                </td>
                <td class="p-4">
                  <div class="flex justify-center gap-2">
                    <p-skeleton shape="circle" size="2rem"></p-skeleton>
                    <p-skeleton shape="circle" size="2rem"></p-skeleton>
                    <p-skeleton shape="circle" size="2rem"></p-skeleton>
                  </div>
                </td>
              </tr>
            </ng-template>
          </p-table>
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
    
    <p-confirmDialog 
      [style]="{width: '450px'}" 
      header="Confirm Deletion" 
      icon="pi pi-exclamation-triangle"
      acceptButtonStyleClass="p-button-danger"
      rejectButtonStyleClass="p-button-text"
    ></p-confirmDialog>
    
    <p-toast position="top-right"></p-toast>
  `
})
export class PfeListComponent implements OnInit {
  pfes: ExtendedPfe[] = [];
  loading: boolean = true;
  selectedPfe: ExtendedPfe | null = null;
  displayDialog: boolean = false;
  
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
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load PFE projects'
        });
        this.loading = false;
        console.error('Error loading PFEs:', error);
      }
    });
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
  
  applyFilter(event: any, filterType: string) {
    const table = document.querySelector('p-table') as any;
    if (table && table['dt']) {
      if (filterType === 'global') {
        table['dt'].filterGlobal(event.target.value, 'contains');
      } else {
        table['dt'].filter(event.value, filterType, 'equals');
      }
    }
  }
  
  clearFilters() {
    const table = document.querySelector('p-table') as any;
    if (table && table['dt']) {
      table['dt'].reset();
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
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'PFE project deleted successfully'
        });
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete PFE project'
        });
        console.error('Error deleting PFE:', error);
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
} 