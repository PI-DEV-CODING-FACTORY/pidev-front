import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { TimelineModule } from 'primeng/timeline';
import { Inscription } from '../../services/inscription.service';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { HttpClient } from '@angular/common/http';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
    selector: 'app-inscription-details',
    standalone: true,
    imports: [
        CommonModule,
        DialogModule,
        TagModule,
        ButtonModule,
        TooltipModule,
        TimelineModule,
        NgxExtendedPdfViewerModule,
    ],
    templateUrl: './inscription-details.component.html',
    styleUrls: ['./inscription-details.component.scss']
})
export class InscriptionDetailsComponent implements OnChanges {
    @Input() visible: boolean = false;
    @Output() visibleChange = new EventEmitter<boolean>();
    @Input() inscription: any;
    @Output() approve = new EventEmitter<Inscription>();
    @Output() reject = new EventEmitter<Inscription>();

    pdfSrc: SafeResourceUrl | null = null;
    isLoadingPdf: boolean = false;

    constructor(
        private http: HttpClient,
        private sanitizer: DomSanitizer
    ) {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes['inscription'] && this.inscription?.id) {
            this.loadPdfDocument();
        }
    
        if (changes['visible'] && !this.visible) {
            this.pdfSrc = null;
        }
    }
    
    

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

    loadPdfDocument() {
        console.log("loading pdf document for inscription id:", this.inscription.id);
        this.isLoadingPdf = true;
        this.http.get(`http://localhost:8080/inscription/${this.inscription.id}/document`, 
            { responseType: 'blob' }
        ).subscribe({
            next: (blob: Blob) => {
                const pdfUrl = URL.createObjectURL(blob);
                this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl);
                this.isLoadingPdf = false;
            },
            error: (error) => {
                console.error('Error loading PDF:', error);
                this.isLoadingPdf = false;
            }
        });
    }

    ngOnDestroy() {
        // Clean up the created URL when component is destroyed
        if (this.pdfSrc) {
            URL.revokeObjectURL(this.pdfSrc as unknown as string);
        }
    }
}
