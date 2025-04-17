import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PfeService } from '../../../services/pfe.service';
import { Pfe } from '../../../models/pfe.model';
import { SavedPfe } from '../../../models/saved-pfe.model';

// PrimeNG Imports
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { SkeletonModule } from 'primeng/skeleton';
import { ChipModule } from 'primeng/chip';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-saved-pfes',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    TagModule,
    ToastModule,
    SkeletonModule,
    ChipModule,
    TooltipModule
  ],
  providers: [MessageService],
  template: `
    <div class="container px-4 py-6 mx-auto">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-800">Saved PFE Projects</h1>
        <p class="mt-2 text-gray-600">Manage your saved PFE projects</p>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="space-y-4">
        <p-skeleton height="3rem" styleClass="mb-2"></p-skeleton>
        <p-skeleton height="2rem" styleClass="mb-2"></p-skeleton>
        <p-skeleton height="2rem" styleClass="mb-2"></p-skeleton>
        <p-skeleton height="2rem" styleClass="mb-2"></p-skeleton>
      </div>

      <!-- Data Table -->
      <p-table
        *ngIf="!loading"
        [value]="savedPfes"
        [paginator]="true"
        [rows]="10"
        [showCurrentPageReport]="true"
        [tableStyle]="{ 'min-width': '50rem' }"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        [rowsPerPageOptions]="[10, 25, 50]"
        styleClass="p-datatable-sm"
      >
        <ng-template pTemplate="header">
          <tr>
            <th>Title</th>
            <th>Technologies</th>
            <th>Status</th>
            <th>Saved Date</th>
            <th>Actions</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-savedPfe>
          <tr>
            <td>
              <div class="font-medium">{{ savedPfe.pfe.title }}</div>
              <div class="text-sm text-gray-500">{{ savedPfe.pfe.description }}</div>
            </td>
            <td>
              <div class="flex flex-wrap gap-1">
                <p-chip *ngFor="let tech of savedPfe.pfe.technologies" [label]="tech" styleClass="text-xs"></p-chip>
              </div>
            </td>
            <td>
              <p-tag [value]="savedPfe.pfe.status" [severity]="getStatusSeverity(savedPfe.pfe.status)"></p-tag>
            </td>
            <td>
              <div class="text-sm text-gray-600">
                {{ savedPfe.savedAt | date:'medium' }}
              </div>
            </td>
            <td>
              <div class="flex gap-2">
                <button 
                  pButton 
                  type="button" 
                  icon="pi pi-eye" 
                  class="p-button-rounded p-button-text"
                  (click)="viewPfe(savedPfe.pfe.id)"
                  pTooltip="View Details"
                ></button>
                <button 
                  pButton 
                  type="button" 
                  icon="pi pi-bookmark-remove" 
                  class="p-button-rounded p-button-text p-button-danger"
                  (click)="unsavePfe(savedPfe.pfe.id)"
                  pTooltip="Remove from Saved"
                ></button>
              </div>
            </td>
          </tr>
        </ng-template>
        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="5" class="text-center p-4">
              <div class="text-gray-500">
                <i class="pi pi-bookmark text-3xl mb-2"></i>
                <p>No saved PFE projects found</p>
              </div>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>

    <p-toast position="top-right"></p-toast>
  `
})
export class SavedPfesComponent implements OnInit {
  savedPfes: SavedPfe[] = [];
  loading: boolean = true;

  constructor(
    private pfeService: PfeService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadSavedPfes();
  }

  loadSavedPfes() {
    this.loading = true;
    this.pfeService.getSavedPfes().subscribe({
      next: (pfes) => {
        this.savedPfes = pfes;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading saved PFEs:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load saved PFEs'
        });
        this.loading = false;
      }
    });
  }

  getStatusSeverity(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'APPROVED':
        return 'success';
      case 'REJECTED':
        return 'danger';
      case 'COMPLETED':
        return 'info';
      default:
        return 'secondary';
    }
  }

  viewPfe(id: number) {
    this.router.navigate(['/pfe', id]);
  }

  unsavePfe(id: number) {
    this.pfeService.unsavePfe(id).subscribe({
      next: () => {
        this.loadSavedPfes(); // Reload the list
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'PFE removed from saved list'
        });
      },
      error: (error) => {
        console.error('Error unsaving PFE:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to remove PFE from saved list'
        });
      }
    });
  }
} 