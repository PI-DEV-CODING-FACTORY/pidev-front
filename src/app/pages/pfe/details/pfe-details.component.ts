import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PfeService } from '../../../services/pfe.service';
import { Pfe, PfeStatus } from '../../../models/pfe.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ChipModule } from 'primeng/chip';
import { SkeletonModule } from 'primeng/skeleton';
import { DividerModule } from 'primeng/divider';
import { ProgressBarModule } from 'primeng/progressbar';
import { TooltipModule } from 'primeng/tooltip';
import { AvatarModule } from 'primeng/avatar';

// Define OpenFor enum
enum OpenFor {
    INTERNSHIP = 'INTERNSHIP',
    JOB = 'JOB',
    BOTH = 'BOTH'
}

// Extended PFE interface to include additional properties
interface ExtendedPfe extends Pfe {
    githubUrl?: string;
    videoUrl?: string;
    openFor?: OpenFor;
    processing?: boolean;
    rapportUrl?: string;
}

@Component({
    selector: 'app-pfe-details',
    standalone: true,
    imports: [CommonModule, ButtonModule, CardModule, TagModule, ToastModule, ConfirmDialogModule, ChipModule, SkeletonModule, DividerModule, ProgressBarModule, TooltipModule, AvatarModule],
    providers: [MessageService, ConfirmationService],
    templateUrl: './pfe-details.component.html'
})
export class PfeDetailsComponent implements OnInit {
    pfeId: number | null = null;
    pfe: ExtendedPfe | null = null;
    loading: boolean = true;
    sanitizedReportUrl: SafeResourceUrl | null = null;
    pdfLoading: boolean = true;
    pdfLoadError: boolean = false;
    useIframe: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private pfeService: PfeService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private location: Location,
        private sanitizer: DomSanitizer
    ) {}

    ngOnInit() {
        this.route.paramMap.subscribe((params) => {
            const id = params.get('id');
            this.pfeId = id ? +id : null;

            if (this.pfeId) {
                this.loadPfeDetails();
            } else {
                this.loading = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Invalid PFE ID'
                });
            }
        });
    }

    loadPfeDetails() {
        if (!this.pfeId) return;

        this.loading = true;
        this.pdfLoading = true;
        this.pdfLoadError = false;
        
        this.pfeService.getPfeById(this.pfeId).subscribe({
            next: (data) => {
                this.pfe = data;
                this.loading = false;
                
                // Initialize sanitizedReportUrl if rapportUrl exists
                if (this.pfe.rapportUrl) {
                    this.sanitizeReportUrl();
                } else {
                    this.pdfLoading = false;
                }
            },
            error: (error) => {
                console.error('Error loading PFE details:', error);
                this.loading = false;
                this.pdfLoading = false;
                
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load PFE details'
                });
            }
        });
    }

    onPdfLoad() {
        console.log('PDF loaded successfully');
        this.pdfLoading = false;
        this.pdfLoadError = false;
    }

    onPdfError() {
        console.log('Error loading PDF');
        this.pdfLoading = false;
        this.pdfLoadError = true;
    }

    togglePdfViewer() {
        this.useIframe = !this.useIframe;
        this.pdfLoading = true;
        this.pdfLoadError = false;
        
        if (this.useIframe && this.pfe?.rapportUrl) {
            // When switching to iframe, we need to sanitize the URL
            this.sanitizedReportUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.pfe.rapportUrl);
        }
        
        this.messageService.add({
            severity: 'info',
            summary: 'Viewer Changed',
            detail: `Switched to ${this.useIframe ? 'iframe' : 'object'} viewer`,
            life: 3000
        });
    }

    sanitizeReportUrl() {
        if (!this.pfe?.rapportUrl) return;
        
        try {
            this.sanitizedReportUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.pfe.rapportUrl);
        } catch (error) {
            console.error('Error sanitizing URL:', error);
            this.sanitizedReportUrl = null;
        }
    }

    /**
     * Checks if an S3 URL is accessible by making a HEAD request
     */
    checkS3UrlAccessibility(url: string) {
        console.log('Checking S3 URL accessibility:', url);
        
        const xhr = new XMLHttpRequest();
        xhr.open('HEAD', url, true);
        
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                console.log('S3 URL is accessible');
            } else {
                console.error('S3 URL is not accessible, status:', xhr.status);
                this.onPdfError();
            }
        };

        xhr.onerror = () => {
            console.error('Error checking S3 URL accessibility');
            this.onPdfError();
        };

        xhr.send();
    }

    getTechnologiesArray(pfe: Pfe): string[] {
        if (typeof pfe.technologies === 'string') {
            return (pfe.technologies as string).split(',').map((tech: string) => tech.trim());
        }
        return (pfe.technologies as string[]) || [];
    }

    getStatusSeverity(status: PfeStatus): 'success' | 'warn' | 'danger' | 'info' | 'secondary' {
        switch (status) {
            case PfeStatus.PENDING:
                return 'warn';
            case PfeStatus.APPROVED:
                return 'success';
            case PfeStatus.REJECTED:
                return 'danger';
            case PfeStatus.COMPLETED:
                return 'info';
            default:
                return 'secondary';
        }
    }

    editPfe() {
        if (!this.pfe?.id) return;
        this.router.navigate(['/pfe/edit', this.pfe.id]);
    }

    confirmDelete() {
        if (!this.pfe) return;

        this.confirmationService.confirm({
            message: `Are you sure you want to delete the PFE project "${this.pfe.title}"?`,
            accept: () => {
                this.deletePfe();
            }
        });
    }

    deletePfe() {
        if (!this.pfe?.id) return;

        this.pfeService.deletePfe(this.pfe.id).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'PFE project deleted successfully'
                });
                setTimeout(() => {
                    this.navigateToPfeList();
                }, 1500);
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to delete PFE project'
                });
                console.error('Error deleting PFE:', error);
            }
        });
    }

    downloadReport() {
        if (!this.pfe?.rapportUrl) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No report URL available',
                life: 3000
            });
            return;
        }

        console.log('Downloading report from URL:', this.pfe.rapportUrl);
        
        try {
            // Create an anchor element and trigger download
            const link = document.createElement('a');
            link.href = this.pfe.rapportUrl;
            
            // Try to extract filename from URL or use a default
            const fileName = this.extractFileNameFromUrl(this.pfe.rapportUrl) || `${this.pfe.title.replace(/\s+/g, '_')}_report.pdf`;
            link.download = fileName;
            
            // Append to body, click and remove
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            this.messageService.add({
                severity: 'success',
                summary: 'Download Started',
                detail: 'Your download has started',
                life: 3000
            });
        } catch (error) {
            console.error('Error downloading report:', error);
            this.messageService.add({
                severity: 'error',
                summary: 'Download Failed',
                detail: 'Failed to download the report. Try opening it in a new tab instead.',
                life: 5000
            });
            
            // Fallback: open in new tab
            window.open(this.pfe.rapportUrl, '_blank');
        }
    }

    /**
     * Extracts a filename from a URL
     */
    extractFileNameFromUrl(url: string): string | null {
        try {
            // Try to get the filename from the URL path
            const urlObj = new URL(url);
            const pathname = urlObj.pathname;
            const segments = pathname.split('/');
            const lastSegment = segments[segments.length - 1];

            // If the last segment contains a filename with extension
            if (lastSegment && lastSegment.includes('.')) {
                return decodeURIComponent(lastSegment);
            }

            return null;
        } catch (error) {
            console.error('Error extracting filename:', error);
            return null;
        }
    }

    openReportInNewTab() {
        if (!this.pfe?.rapportUrl) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No report URL available',
                life: 3000
            });
            return;
        }

        window.open(this.pfe.rapportUrl, '_blank');
    }

    shareProject() {
        if (!this.pfe) return;

        // Create a shareable URL
        const url = window.location.href;

        // Copy to clipboard
        navigator.clipboard
            .writeText(url)
            .then(() => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Link Copied',
                    detail: 'Project link has been copied to clipboard'
                });
            })
            .catch(() => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to copy link to clipboard'
                });
            });
    }

    navigateToPfeList() {
        this.router.navigate(['/pfe']);
    }

    goBack() {
        this.location.back();
    }
}
