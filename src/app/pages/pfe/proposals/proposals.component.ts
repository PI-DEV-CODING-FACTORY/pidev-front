import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProposalService } from '../../../services/proposal.service';
import { Proposal, JobType } from '../../../models/proposal.model';

// PrimeNG Imports
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';
import { AvatarModule } from 'primeng/avatar';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-proposals',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DataViewModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    ToastModule,
    CardModule,
    TagModule,
    ChipModule,
    AvatarModule,
    DialogModule,
    DividerModule
  ],
  providers: [MessageService],
  template: `
    <div class="grid">
      <div class="col-12">
        <div class="card">
          <h5>Job Proposals</h5>
          <p>Explore job opportunities from various companies.</p>
          
          <!-- Search and Filter -->
          <div class="flex flex-column md:flex-row justify-content-between mb-4">
            <div class="p-input-icon-left mb-3 md:mb-0 md:w-4">
              <i class="pi pi-search"></i>
              <input type="text" pInputText placeholder="Search by keyword" [(ngModel)]="searchKeyword" (input)="onSearch()"/>
            </div>
            
            <div class="flex flex-column md:flex-row gap-3">
              <p-dropdown [options]="jobTypes" placeholder="Job Type" [(ngModel)]="selectedJobType" (onChange)="onSearch()"></p-dropdown>
              <p-dropdown [options]="locations" placeholder="Location" [(ngModel)]="selectedLocation" (onChange)="onSearch()"></p-dropdown>
              <button pButton type="button" label="Clear Filters" icon="pi pi-filter-slash" class="p-button-outlined" (click)="clearFilters()"></button>
            </div>
          </div>
          
          <!-- Proposals DataView -->
          <p-dataView #dv [value]="proposals" [layout]="layout" [paginator]="true" [rows]="9" [loading]="loading">
            <ng-template pTemplate="header">
              <div class="flex justify-content-end">
                <button pButton type="button" icon="pi pi-th-large" (click)="layout = 'grid'" class="p-button-text" [disabled]="layout === 'grid'"></button>
                <button pButton type="button" icon="pi pi-bars" (click)="layout = 'list'" class="p-button-text ml-2" [disabled]="layout === 'list'"></button>
              </div>
            </ng-template>
            
            <ng-template let-proposal pTemplate="listItem">
              <div class="col-12">
                <div class="flex flex-column md:flex-row align-items-center p-3 w-full">
                  <div class="flex align-items-center justify-content-center mr-3">
                    <p-avatar [image]="proposal.companyLogo" shape="circle" size="large" [style]="{'width': '64px', 'height': '64px'}" 
                      *ngIf="proposal.companyLogo" styleClass="mr-3"></p-avatar>
                    <p-avatar icon="pi pi-building" shape="circle" size="large" [style]="{'width': '64px', 'height': '64px'}" 
                      *ngIf="!proposal.companyLogo" styleClass="mr-3"></p-avatar>
                  </div>
                  
                  <div class="flex-1">
                    <div class="flex align-items-center justify-content-between mb-2">
                      <h5 class="font-bold m-0">{{ proposal.title }}</h5>
                      <p-tag [value]="getJobTypeLabel(proposal.jobType)" [severity]="getJobTypeSeverity(proposal.jobType)"></p-tag>
                    </div>
                    
                    <div class="flex flex-column md:flex-row justify-content-between">
                      <div class="flex align-items-center">
                        <span class="pi pi-building mr-2"></span>
                        <span class="font-semibold">{{ proposal.company }}</span>
                      </div>
                      
                      <div class="flex align-items-center mt-2 md:mt-0">
                        <span class="pi pi-map-marker mr-2"></span>
                        <span>{{ proposal.location }}</span>
                        <span *ngIf="proposal.isRemote" class="ml-2">(Remote Available)</span>
                      </div>
                      
                      <div class="flex align-items-center mt-2 md:mt-0">
                        <span class="pi pi-calendar mr-2"></span>
                        <span>Deadline: {{ proposal.applicationDeadline | date:'mediumDate' }}</span>
                      </div>
                    </div>
                    
                    <div class="mt-2">
                      <p class="line-height-3 m-0">{{ proposal.description | slice:0:200 }}...</p>
                    </div>
                    
                    <div class="flex flex-wrap gap-2 mt-3">
                      <p-chip *ngFor="let tech of proposal.technologies" [label]="tech"></p-chip>
                    </div>
                    
                    <div class="flex justify-content-between align-items-center mt-3">
                      <div *ngIf="proposal.salary" class="font-semibold">
                        <span class="pi pi-money-bill mr-2"></span>
                        {{ proposal.salary | currency:'TND':'symbol':'1.0-0' }} / month
                      </div>
                      <div class="flex gap-2">
                        <button pButton type="button" label="View Details" class="p-button-outlined" (click)="viewDetails(proposal)"></button>
                        <button pButton type="button" label="Apply Now" class="p-button-primary" (click)="applyForJob(proposal)"></button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ng-template>
            
            <ng-template let-proposal pTemplate="gridItem">
              <div class="col-12 md:col-4">
                <div class="p-3 border-1 surface-border surface-card h-full">
                  <div class="flex flex-column align-items-center text-center mb-3">
                    <p-avatar [image]="proposal.companyLogo" shape="circle" size="large" [style]="{'width': '64px', 'height': '64px'}" 
                      *ngIf="proposal.companyLogo"></p-avatar>
                    <p-avatar icon="pi pi-building" shape="circle" size="large" [style]="{'width': '64px', 'height': '64px'}" 
                      *ngIf="!proposal.companyLogo"></p-avatar>
                    <div class="text-2xl font-bold mt-2">{{ proposal.company }}</div>
                    <p-tag [value]="getJobTypeLabel(proposal.jobType)" [severity]="getJobTypeSeverity(proposal.jobType)" class="mt-2"></p-tag>
                  </div>
                  
                  <h5 class="mb-2 text-center">{{ proposal.title }}</h5>
                  
                  <div class="mb-3 text-center">
                    <span class="pi pi-map-marker mr-2"></span>
                    <span>{{ proposal.location }}</span>
                    <span *ngIf="proposal.isRemote" class="ml-2">(Remote)</span>
                  </div>
                  
                  <p class="mb-3 line-height-3">{{ proposal.description | slice:0:150 }}...</p>
                  
                  <div class="flex flex-wrap gap-2 justify-content-center mb-3">
                    <p-chip *ngFor="let tech of proposal.technologies.slice(0, 3)" [label]="tech"></p-chip>
                    <p-chip *ngIf="proposal.technologies.length > 3" [label]="'+' + (proposal.technologies.length - 3)"></p-chip>
                  </div>
                  
                  <div class="flex flex-column gap-2">
                    <button pButton type="button" label="View Details" class="p-button-outlined" (click)="viewDetails(proposal)"></button>
                    <button pButton type="button" label="Apply Now" class="p-button-primary" (click)="applyForJob(proposal)"></button>
                  </div>
                </div>
              </div>
            </ng-template>
            
            <ng-template pTemplate="emptymessage">
              <div class="text-center p-5">
                <div *ngIf="loading">Loading job proposals...</div>
                <div *ngIf="!loading">
                  <i class="pi pi-search" style="font-size: 3rem"></i>
                  <p>No job proposals found matching your criteria.</p>
                </div>
              </div>
            </ng-template>
          </p-dataView>
        </div>
      </div>
    </div>
    
    <!-- Proposal Details Dialog -->
    <p-dialog [(visible)]="displayDialog" [style]="{width: '90%', maxWidth: '800px'}" [modal]="true" [draggable]="false" [resizable]="false">
      <ng-template pTemplate="header">
        <div class="flex align-items-center">
          <p-avatar [image]="selectedProposal?.companyLogo" shape="circle" *ngIf="selectedProposal?.companyLogo" styleClass="mr-2"></p-avatar>
          <p-avatar icon="pi pi-building" shape="circle" *ngIf="selectedProposal && !selectedProposal.companyLogo" styleClass="mr-2"></p-avatar>
          <span>{{ selectedProposal?.title }}</span>
        </div>
      </ng-template>
      
      <div *ngIf="selectedProposal">
        <div class="flex justify-content-between mb-4">
          <div>
            <h5 class="mb-1">{{ selectedProposal.company }}</h5>
            <div class="flex align-items-center">
              <span class="pi pi-map-marker mr-2"></span>
              <span>{{ selectedProposal.location }}</span>
              <span *ngIf="selectedProposal.isRemote" class="ml-2">(Remote Available)</span>
            </div>
          </div>
          <p-tag [value]="getJobTypeLabel(selectedProposal.jobType)" [severity]="getJobTypeSeverity(selectedProposal.jobType)"></p-tag>
        </div>
        
        <p-divider></p-divider>
        
        <h6>Job Description</h6>
        <p class="line-height-3">{{ selectedProposal.description }}</p>
        
        <h6>Requirements</h6>
        <p class="line-height-3">{{ selectedProposal.requirements }}</p>
        
        <h6>Technologies</h6>
        <div class="flex flex-wrap gap-2 mb-4">
          <p-chip *ngFor="let tech of selectedProposal.technologies" [label]="tech"></p-chip>
        </div>
        
        <div class="grid">
          <div class="col-12 md:col-6">
            <h6>Salary</h6>
            <p>{{ selectedProposal.salary ? (selectedProposal.salary | currency:'TND':'symbol':'1.0-0') + ' / month' : 'Not specified' }}</p>
          </div>
          
          <div class="col-12 md:col-6">
            <h6>Application Deadline</h6>
            <p>{{ selectedProposal.applicationDeadline | date:'mediumDate' }}</p>
          </div>
        </div>
        
        <h6>Contact Information</h6>
        <p>
          <span class="pi pi-envelope mr-2"></span>
          <a [href]="'mailto:' + selectedProposal.contactEmail">{{ selectedProposal.contactEmail }}</a>
        </p>
      </div>
      
      <ng-template pTemplate="footer">
        <button pButton type="button" label="Close" icon="pi pi-times" class="p-button-outlined" (click)="displayDialog = false"></button>
        <button pButton type="button" label="Apply Now" icon="pi pi-check" class="p-button-primary ml-2" (click)="applyForJob(selectedProposal!)"></button>
      </ng-template>
    </p-dialog>
    
    <p-toast></p-toast>
  `
})
export class ProposalsComponent implements OnInit {
  proposals: Proposal[] = [];
  loading: boolean = true;
  layout: 'list' | 'grid' = 'grid';
  
  // Filters
  searchKeyword: string = '';
  selectedJobType: string | null = null;
  selectedLocation: string | null = null;
  
  // Filter options
  jobTypes: any[] = [];
  locations: any[] = [];
  
  // Dialog
  displayDialog: boolean = false;
  selectedProposal: Proposal | null = null;
  
  constructor(
    private proposalService: ProposalService,
    private messageService: MessageService
  ) {}
  
  ngOnInit() {
    this.loadProposals();
    this.initFilterOptions();
  }
  
  loadProposals() {
    this.loading = true;
    this.proposalService.getAllProposals().subscribe({
      next: (data) => {
        this.proposals = data;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load job proposals'
        });
        this.loading = false;
        console.error('Error loading proposals:', error);
      }
    });
  }
  
  initFilterOptions() {
    // Job Types
    this.jobTypes = [
      { label: 'Full Time', value: JobType.FULL_TIME },
      { label: 'Part Time', value: JobType.PART_TIME },
      { label: 'Contract', value: JobType.CONTRACT },
      { label: 'Internship', value: JobType.INTERNSHIP }
    ];
    
    // Locations (would typically come from an API)
    this.locations = [
      { label: 'Tunis', value: 'Tunis' },
      { label: 'Sousse', value: 'Sousse' },
      { label: 'Sfax', value: 'Sfax' },
      { label: 'Ariana', value: 'Ariana' },
      { label: 'Remote', value: 'Remote' }
    ];
  }
  
  onSearch() {
    this.loading = true;
    
    // Prepare search parameters
    const params: any = {};
    
    if (this.searchKeyword) {
      params.keyword = this.searchKeyword;
    }
    
    if (this.selectedJobType) {
      params.jobType = this.selectedJobType;
    }
    
    if (this.selectedLocation) {
      params.location = this.selectedLocation;
    }
    
    this.proposalService.searchProposals(params).subscribe({
      next: (data) => {
        this.proposals = data;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to search job proposals'
        });
        this.loading = false;
        console.error('Error searching proposals:', error);
      }
    });
  }
  
  clearFilters() {
    this.searchKeyword = '';
    this.selectedJobType = null;
    this.selectedLocation = null;
    this.loadProposals();
  }
  
  viewDetails(proposal: Proposal) {
    this.selectedProposal = proposal;
    this.displayDialog = true;
  }
  
  applyForJob(proposal: Proposal) {
    // This would typically navigate to an application form or show an application dialog
    this.messageService.add({
      severity: 'success',
      summary: 'Application Submitted',
      detail: `Your application for ${proposal.title} at ${proposal.company} has been submitted.`
    });
    
    if (this.displayDialog) {
      this.displayDialog = false;
    }
  }
  
  getJobTypeLabel(jobType: JobType): string {
    switch (jobType) {
      case JobType.FULL_TIME:
        return 'Full Time';
      case JobType.PART_TIME:
        return 'Part Time';
      case JobType.CONTRACT:
        return 'Contract';
      case JobType.INTERNSHIP:
        return 'Internship';
      default:
        return 'Unknown';
    }
  }
  
  getJobTypeSeverity(jobType: JobType): 'success' | 'info' | 'warn' | 'danger' | undefined {
    switch (jobType) {
      case JobType.FULL_TIME:
        return 'success';
      case JobType.PART_TIME:
        return 'info';
      case JobType.CONTRACT:
        return 'warn';
      case JobType.INTERNSHIP:
        return 'info';
      default:
        return undefined;
    }
  }
} 