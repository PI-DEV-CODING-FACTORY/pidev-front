import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProposalService } from '../../../services/proposal.service';
import { Proposal, ProposalStatus } from '../../../models/proposal.model';
import { RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

// PrimeNG Imports
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-proposals',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TableModule,
    ButtonModule,
    ToastModule,
    CardModule,
    TagModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ProposalService, ConfirmationService],
  template: `
    <div class="grid">
      <div class="col-12">
        <div class="card">
          <h5>Proposals</h5>
          <p>Manage your received proposals</p>
          
          <p-table 
            [value]="proposals" 
            [loading]="loading"
            [paginator]="true" 
            [rows]="10"
            [showCurrentPageReport]="true"
            responsiveLayout="scroll"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} proposals"
            [rowsPerPageOptions]="[10,25,50]"
            styleClass="p-datatable-gridlines">
            
            <ng-template pTemplate="header">
              <tr>
                <th>ID</th>
                <th>Company</th>
                <th>Message</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </ng-template>
            
            <ng-template pTemplate="body" let-proposal>
              <tr>
                <td>{{proposal.id}}</td>
                <td>{{proposal.companyId}}</td>
                <td>{{proposal.message}}</td>
                <td>
                  <p-tag 
                    [value]="proposal.status" 
                    [severity]="getStatusSeverity(proposal.status)">
                  </p-tag>
                </td>
                <td>{{proposal.createdAt | date:'medium'}}</td>
                <td>
                  <div class="flex gap-2">
                    <button 
                      pButton 
                      type="button" 
                      label="Accept" 
                      class="p-button-success" 
                      [disabled]="proposal.status !== 'PENDING'"
                      (click)="onAcceptProposal(proposal)">
                    </button>
                    <button 
                      pButton 
                      type="button" 
                      label="Decline" 
                      class="p-button-danger" 
                      [disabled]="proposal.status !== 'PENDING'"
                      (click)="onDeclineProposal(proposal)">
                    </button>
                  </div>
                </td>
              </tr>
            </ng-template>
            
            <ng-template pTemplate="emptymessage">
              <tr>
                <td colspan="6" class="text-center p-5">
                  <div *ngIf="loading">Loading proposals...</div>
                  <div *ngIf="!loading">
                    No proposals found.
                  </div>
                </td>
              </tr>
            </ng-template>
          </p-table>
        </div>
      </div>
    </div>
    
    <p-toast></p-toast>
    <p-confirmDialog header="Confirmation" icon="pi pi-exclamation-triangle"></p-confirmDialog>
  `
})
export class ProposalsComponent implements OnInit {
  proposals: Proposal[] = [];
  loading: boolean = true;
  
  constructor(
    private proposalService: ProposalService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}
  
  ngOnInit() {
    this.loadProposals();
  }
  
  loadProposals() {
    this.loading = true;
    this.proposalService.getProposalsByStudentId(1).subscribe({
      next: (data) => {
        this.proposals = data;
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error loading proposals:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.status === 0 
            ? 'Could not connect to the server. Please check if the backend is running.'
            : `Failed to load proposals: ${error.message || 'Unknown error'}`
        });
        this.loading = false;
        this.proposals = [];
      }
    });
  }
  
  getStatusSeverity(status: ProposalStatus): 'success' | 'info' | 'warn' | 'danger' {
    switch (status) {
      case ProposalStatus.ACCEPTED:
        return 'success';
      case ProposalStatus.DECLINED:
        return 'danger';
      case ProposalStatus.PENDING:
        return 'warn';
      default:
        return 'info';
    }
  }
  
  onAcceptProposal(proposal: Proposal) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to accept this proposal?',
      accept: () => {
        this.proposalService.updateProposalStatus(proposal.id, ProposalStatus.ACCEPTED).subscribe({
          next: () => {
            proposal.status = ProposalStatus.ACCEPTED;
            proposal.respondedAt = new Date().toISOString();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Proposal accepted successfully'
            });
          },
          error: (error: HttpErrorResponse) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to accept proposal'
            });
            console.error('Error accepting proposal:', error);
          }
        });
      }
    });
  }
  
  onDeclineProposal(proposal: Proposal) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to decline this proposal?',
      accept: () => {
        this.proposalService.updateProposalStatus(proposal.id, ProposalStatus.DECLINED).subscribe({
          next: () => {
            proposal.status = ProposalStatus.DECLINED;
            proposal.respondedAt = new Date().toISOString();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Proposal declined successfully'
            });
          },
          error: (error: HttpErrorResponse) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to decline proposal'
            });
            console.error('Error declining proposal:', error);
          }
        });
      }
    });
  }
} 