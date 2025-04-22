import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { TimelineModule } from 'primeng/timeline';
import { Inscription } from '../../services/inscription.service';

@Component({
    selector: 'app-inscription-details',
    standalone: true,
    imports: [
        CommonModule,
        DialogModule,
        TagModule,
        ButtonModule,
        TooltipModule,
        TimelineModule
    ],
    templateUrl: './inscription-details.component.html',
    styleUrls: ['./inscription-details.component.scss']
})
export class InscriptionDetailsComponent {
    @Input() visible: boolean = false;
    @Output() visibleChange = new EventEmitter<boolean>();
    @Input() inscription: any;
    @Output() approve = new EventEmitter<Inscription>();
    @Output() reject = new EventEmitter<Inscription>();

    closeModal() {
        this.visible = false;
        this.visibleChange.emit(false);
    }

    onApprove() {
        this.approve.emit(this.inscription);
        this.closeModal();
    }

    onReject() {
        this.reject.emit(this.inscription);
        this.closeModal();
    }

    getStatusSeverity(status: string): string {
        switch (status?.toLowerCase()) {
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
}
