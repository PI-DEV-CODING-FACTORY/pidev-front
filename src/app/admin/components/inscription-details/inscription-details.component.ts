import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { Inscription } from '../../services/inscription.service';

@Component({
    selector: 'app-inscription-details',
    standalone: true,
    imports: [CommonModule, DialogModule, TagModule],
    templateUrl: './inscription-details.component.html',
    styleUrls: ['./inscription-details.component.scss']
})
export class InscriptionDetailsComponent {
    @Input() visible: boolean = false;
    @Output() visibleChange = new EventEmitter<boolean>();
    @Input() inscription: any;

    closeModal() {
        this.visible = false;
        this.visibleChange.emit(false);
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
