import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { HttpClientModule } from '@angular/common/http';
import { InscriptionService, Inscription } from '../../../services/inscription.service';
import { finalize, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    PaginatorModule,
    DropdownModule,
    TooltipModule,
    ConfirmDialogModule,
    ToastModule
  ],
  providers: [ConfirmationService, MessageService, InscriptionService],
  templateUrl: './inscription.component.html',
  styleUrl: './inscription.component.scss'
})
export class InscriptionComponent implements OnInit {
  inscriptions: Inscription[] = [];
  filteredInscriptions: Inscription[] = [];
  statuses: any[] = [];
  loading: boolean = false;
  searchQuery: string = '';
  
  constructor(
    private inscriptionService: InscriptionService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadInscriptions();
    this.statuses = [
      { label: 'Pending', value: 'Pending' },
      { label: 'Approved', value: 'Approved' },
      { label: 'Rejected', value: 'Rejected' }
    ];
  }

  loadInscriptions() {
    this.loading = true;
    this.inscriptionService.getAllInscriptions()
      .pipe(
        finalize(() => this.loading = false),
        catchError(error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load inscriptions. Please try again.'
          });
          console.error('Error loading inscriptions:', error);
          return of([]);
        })
      )
      .subscribe(data => {
        this.inscriptions = data;
        this.filteredInscriptions = [...this.inscriptions];
      });
  }

  getStatusSeverity(status: string) {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'approved':
        return 'success';
      case 'rejected':
        return 'danger';
      default:
        return 'info';
    }
  }

  confirmDelete(inscription: Inscription) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the inscription for ${inscription.firstName} ${inscription.lastName}?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.inscriptionService.deleteInscription(inscription.id)
          .pipe(
            catchError(error => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete inscription. Please try again.'
              });
              console.error('Error deleting inscription:', error);
              return of(null);
            })
          )
          .subscribe(() => {
            this.inscriptions = this.inscriptions.filter(i => i.id !== inscription.id);
            this.filteredInscriptions = this.filteredInscriptions.filter(i => i.id !== inscription.id);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Inscription deleted successfully'
            });
          });
      }
    });
  }

  updateStatus(inscription: Inscription, newStatus: string) {
    this.inscriptionService.updateInscriptionStatus(inscription.id, newStatus)
      .pipe(
        catchError(error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update status. Please try again.'
          });
          console.error('Error updating status:', error);
          return of(null);
        })
      )
      .subscribe(() => {
        const index = this.inscriptions.findIndex(i => i.id === inscription.id);
        if (index !== -1) {
          this.inscriptions[index].status = newStatus;
          this.filteredInscriptions = [...this.inscriptions];
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Status updated to ${newStatus}`
          });
        }
      });
  }

  searchInscriptions() {
    if (!this.searchQuery.trim()) {
      this.filteredInscriptions = [...this.inscriptions];
      return;
    }

    const query = this.searchQuery.toLowerCase();
    this.filteredInscriptions = this.inscriptions.filter(inscription => 
      inscription.firstName.toLowerCase().includes(query) ||
      inscription.lastName.toLowerCase().includes(query) ||
      inscription.personalEmail.toLowerCase().includes(query) ||
      inscription.courseId.toLowerCase().includes(query)
    );
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }
}
