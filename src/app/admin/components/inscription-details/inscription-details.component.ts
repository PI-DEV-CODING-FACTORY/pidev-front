import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { Inscription } from '../../services/inscription.service';

@Component({
    selector: 'app-inscription-details',
    standalone: true,
    imports: [CommonModule, DialogModule, TagModule],
    templateUrl: './inscription-details.component.html'
})
export class InscriptionDetailsComponent {
    @Input() visible: boolean = false;
    @Output() visibleChange = new EventEmitter<boolean>();
    @Input() inscription: Inscription | null = null;

    closeModal() {
        this.visible = false;
        this.visibleChange.emit(false);
    }
}
