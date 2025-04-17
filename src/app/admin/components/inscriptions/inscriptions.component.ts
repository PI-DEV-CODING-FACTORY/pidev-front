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
        DialogModule,
        DropdownModule,
        TagModule,
        ConfirmDialogModule
    ],
    providers: [MessageService, InscriptionService, ConfirmationService]
})
export class InscriptionsComponent implements OnInit {
    inscriptions = signal<Inscription[]>([]);
    detailsDialog: boolean = false;
    selectedInscription: Inscription | null = null;
    statuses: any[] = ['Pending', 'Approved', 'Rejected'];
    paymentStatuses: any[] = ['Paid', 'Pending', 'Not Paid'];

    @ViewChild('dt') dt: Table | undefined;

    constructor(
        private inscriptionService: InscriptionService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit() {
        this.loadInscriptions();
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

    viewDetails(inscription: Inscription) {
        this.selectedInscription = inscription;
        this.detailsDialog = true;
    }

    editInscription(inscription: Inscription) {
        // Implement edit functionality
        console.log('Edit inscription:', inscription);
    }
}
