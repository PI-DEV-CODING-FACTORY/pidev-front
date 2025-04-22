import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule, Table } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Inscription, InscriptionService } from '../../services/inscription.service';
import { InscriptionDetailsComponent } from '../inscription-details/inscription-details.component';

@Component({
    selector: 'app-inscriptions',
    standalone: true,
    templateUrl: './inscriptions.component.html',
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        InputTextModule,
        TagModule,
        DialogModule,
        InscriptionDetailsComponent
    ],
    providers: [MessageService, InscriptionService]
})
export class InscriptionsComponent implements OnInit {
    inscriptions = signal<Inscription[]>([]);
    displayDialog: boolean = false;
    selectedInscription: Inscription | null = null;
    @ViewChild('dt') dt: Table | undefined;

    constructor(
        private inscriptionService: InscriptionService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.loadInscriptions();
    }

    onViewClick(inscription: Inscription) {
        this.selectedInscription = inscription;
        this.displayDialog = true;
    }

    loadInscriptions() {
        this.inscriptionService.getInscriptions().subscribe({
            next: (data) => {
                console.log('Inscriptions retrieved:', data);
                this.inscriptions.set(data);
            },
            error: (error) => {
                console.error('Error fetching inscriptions:', error);
                this.messageService.add({ 
                    severity: 'error', 
                    summary: 'Error', 
                    detail: 'Failed to load inscriptions' 
                });
            }
        });
    }

    getSeverity(status: string) {
        switch (status?.toLowerCase()) {
            case 'approved':
                return 'success';
            case 'rejected':
                return 'danger';
            case 'pending':
                return 'warn';
            default:
                return 'info';
        }
    }

    getPaymentSeverity(status: string) {
        switch (status?.toLowerCase()) {
            case 'paid':
                return 'success';
            case 'not paid':
                return 'danger';
            case 'pending':
                return 'warn';
            default:
                return 'info';
        }
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    onDialogHide() {
        this.selectedInscription = null;
    }

    onApproveInscription(inscription: Inscription) {
        // Here you would typically call your service to update the inscription status
        const index = this.inscriptions().findIndex(i => i.id === inscription.id);
        if (index !== -1) {
            const updatedInscriptions = [...this.inscriptions()];
            updatedInscriptions[index] = { ...updatedInscriptions[index], status: 'approved' };
            this.inscriptions.set(updatedInscriptions);
            
            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Inscription approved successfully'
            });
        }
    }

    onRejectInscription(inscription: Inscription) {
        // Here you would typically call your service to update the inscription status
        const index = this.inscriptions().findIndex(i => i.id === inscription.id);
        if (index !== -1) {
            const updatedInscriptions = [...this.inscriptions()];
            updatedInscriptions[index] = { ...updatedInscriptions[index], status: 'rejected' };
            this.inscriptions.set(updatedInscriptions);
            
            this.messageService.add({
                severity: 'info',
                summary: 'Rejected',
                detail: 'Inscription has been rejected'
            });
        }
    }
}
