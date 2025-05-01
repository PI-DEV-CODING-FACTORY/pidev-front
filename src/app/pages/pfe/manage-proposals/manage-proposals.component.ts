import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProposalService } from '../../../services/proposal.service';
import { Proposal, ProposalStatus } from '../../../models/proposal.model';

// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { InputTextarea } from 'primeng/inputtextarea';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { DividerModule } from 'primeng/divider';
import { CalendarModule } from 'primeng/calendar';

import { MessageService, ConfirmationService } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-manage-proposals',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        CardModule,
        ButtonModule,
        ToastModule,
        ConfirmDialogModule,
        AvatarModule,
        BadgeModule,
        TagModule,
        TooltipModule,
        SkeletonModule,
        ProgressSpinnerModule,
        DialogModule,
        InputTextarea,
        ScrollPanelModule,
        DividerModule,
        CalendarModule
    ],
    providers: [MessageService, ConfirmationService],
    template: `
        <div class="p-4">
            <div class="mb-4">
                <h2 class="text-2xl font-medium mb-2">Manage Proposals</h2>
                <p class="text-gray-600">View and manage all proposals in a Kanban-style layout</p>
            </div>

            <div *ngIf="loading" class="flex justify-center items-center py-8">
                <p-progressSpinner></p-progressSpinner>
            </div>

            <div *ngIf="!loading" class="flex gap-4 w-full overflow-x-auto min-h-[calc(100vh-12rem)]">
                <!-- Pending Status Section -->
                <div class="bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col min-w-[300px]">
                    <div class="p-4 bg-white rounded-t-lg border-b border-gray-100">
                        <div class="flex items-center justify-between mb-2">
                            <div class="flex items-center">
                                <i class="pi pi-clock mr-2 text-yellow-500"></i>
                                <h3 class="text-lg font-medium">Pending</h3>
                            </div>
                            <span class="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-1 rounded-full">{{ getProposalsByStatus(ProposalStatus.PENDING).length }}</span>
                        </div>
                        <div class="border-b border-gray-200"></div>
                    </div>

                    <div class="flex-1 overflow-hidden">
                        <p-scrollPanel [style]="{ width: '100%', height: '70vh' }" styleClass="!border-none">
                            <div *ngIf="getProposalsByStatus(ProposalStatus.PENDING).length === 0" class="flex flex-col items-center justify-center p-6 text-center bg-gray-50 rounded-lg m-4">
                                <i class="pi pi-inbox text-4xl text-gray-300 mb-2"></i>
                                <p class="text-gray-500">No pending proposals</p>
                            </div>

                            <div *ngFor="let proposal of getProposalsByStatus(ProposalStatus.PENDING)" class="m-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                                <div class="flex justify-between items-center p-3 bg-yellow-50 border-b border-yellow-200 rounded-t-xl">
                                    <div class="flex items-center">
                                        <span class="font-medium">Proposal #{{ proposal.id }}</span>
                                    </div>
                                    <span class="bg-yellow-100 text-yellow-800 text-xs px-2.5 py-0.5 rounded">PENDING</span>
                                </div>

                                <div class="p-4">
                                    <div class="grid grid-cols-2 gap-4 mb-3">
                                        <div>
                                            <p class="text-sm text-gray-500 mb-1">Company:</p>
                                            <p class="font-medium">{{ proposal.companyId }}</p>
                                        </div>
                                        <div>
                                            <p class="text-sm text-gray-500 mb-1">Student:</p>
                                            <p class="font-medium">{{ proposal.studentId }}</p>
                                        </div>
                                    </div>

                                    <div class="mb-3">
                                        <p class="text-sm text-gray-500 mb-1">Message:</p>
                                        <p class="text-gray-700 text-sm">{{ truncateText(proposal.message, 100) }}</p>
                                    </div>

                                    <div class="mb-4">
                                        <p class="text-sm text-gray-500 mb-1">Created:</p>
                                        <p class="text-gray-700 text-sm">{{ proposal.createdAt | date: 'medium' }}</p>
                                    </div>
                                </div>
                            </div>
                        </p-scrollPanel>
                    </div>
                </div>

                <!-- Accepted Status Section -->
                <div class="bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col min-w-[300px]">
                    <div class="p-4 bg-white rounded-t-lg border-b border-gray-100">
                        <div class="flex items-center justify-between mb-2">
                            <div class="flex items-center">
                                <i class="pi pi-check-circle mr-2 text-green-500"></i>
                                <h3 class="text-lg font-medium">Accepted Proposals</h3>
                            </div>
                            <span class="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded-full">{{ getProposalsByStatus(ProposalStatus.ACCEPTED).length }}</span>
                        </div>
                        <div class="border-b border-gray-200"></div>
                    </div>

                    <div class="flex-1 overflow-hidden">
                        <p-scrollPanel [style]="{ width: '100%', height: '70vh' }" styleClass="!border-none">
                            <div *ngIf="getProposalsByStatus(ProposalStatus.ACCEPTED).length === 0" class="flex flex-col items-center justify-center p-6 text-center bg-gray-50 rounded-lg m-4">
                                <i class="pi pi-inbox text-4xl text-gray-300 mb-2"></i>
                                <p class="text-gray-500">No accepted proposals</p>
                            </div>

                            <div *ngFor="let proposal of getProposalsByStatus(ProposalStatus.ACCEPTED)" class="m-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                                <div class="flex justify-between items-center p-3 bg-green-50 border-b border-green-200 rounded-t-xl">
                                    <div class="flex items-center">
                                        <span class="font-medium">Proposal #{{ proposal.id }}</span>
                                    </div>
                                    <span class="bg-green-100 text-green-800 text-xs px-2.5 py-0.5 rounded">ACCEPTED</span>
                                </div>

                                <div class="p-4">
                                    <div class="grid grid-cols-2 gap-4 mb-3">
                                        <div>
                                            <p class="text-sm text-gray-500 mb-1">Company:</p>
                                            <p class="font-medium">{{ proposal.companyId }}</p>
                                        </div>
                                        <div>
                                            <p class="text-sm text-gray-500 mb-1">Student:</p>
                                            <p class="font-medium">{{ proposal.studentId }}</p>
                                        </div>
                                    </div>

                                    <div class="mb-3">
                                        <p class="text-sm text-gray-500 mb-1">Message:</p>
                                        <p class="text-gray-700 text-sm">{{ truncateText(proposal.message, 100) }}</p>
                                    </div>

                                    <div class="mb-4">
                                        <p class="text-sm text-gray-500 mb-1">Responded:</p>
                                        <p class="text-gray-700 text-sm">{{ proposal.respondedAt | date: 'medium' }}</p>
                                    </div>
                                </div>
                            </div>
                        </p-scrollPanel>
                    </div>
                </div>

                <!-- Passed Status Section -->
                <div class="bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col min-w-[300px]">
                    <div class="p-4 bg-white rounded-t-lg border-b border-gray-100">
                        <div class="flex items-center justify-between mb-2">
                            <div class="flex items-center">
                                <i class="pi pi-thumbs-up mr-2 text-green-600"></i>
                                <h3 class="text-lg font-medium">Passed Test</h3>
                            </div>
                            <span class="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded-full">{{ getProposalsByStatus(ProposalStatus.PASSED).length }}</span>
                        </div>
                        <div class="border-b border-gray-200"></div>
                    </div>

                    <div class="flex-1 overflow-hidden">
                        <p-scrollPanel [style]="{ width: '100%', height: '70vh' }" styleClass="!border-none">
                            <div *ngIf="getProposalsByStatus(ProposalStatus.PASSED).length === 0" class="flex flex-col items-center justify-center p-6 text-center bg-gray-50 rounded-lg m-4">
                                <i class="pi pi-inbox text-4xl text-gray-300 mb-2"></i>
                                <p class="text-gray-500">No passed proposals</p>
                            </div>

                            <div *ngFor="let proposal of getProposalsByStatus(ProposalStatus.PASSED)" class="m-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                                <div class="flex justify-between items-center p-3 bg-green-50 border-b border-green-200 rounded-t-xl">
                                    <div class="flex items-center">
                                        <span class="font-medium">Proposal #{{ proposal.id }}</span>
                                    </div>
                                    <span class="bg-green-100 text-green-800 text-xs px-2.5 py-0.5 rounded">PASSED</span>
                                </div>

                                <div class="p-4">
                                    <div class="grid grid-cols-2 gap-4 mb-3">
                                        <div>
                                            <p class="text-sm text-gray-500 mb-1">Company:</p>
                                            <p class="font-medium">{{ proposal.companyId }}</p>
                                        </div>
                                        <div>
                                            <p class="text-sm text-gray-500 mb-1">Student:</p>
                                            <p class="font-medium">{{ proposal.studentId }}</p>
                                        </div>
                                    </div>

                                    <div class="mb-3">
                                        <p class="text-sm text-gray-500 mb-1">Message:</p>
                                        <p class="text-gray-700 text-sm">{{ truncateText(proposal.message, 100) }}</p>
                                    </div>

                                    <div class="mb-4">
                                        <p class="text-sm text-gray-500 mb-1">Final Status:</p>
                                        <p class="text-gray-700 text-sm">{{ proposal.status }}</p>
                                    </div>

                                    <div class="flex justify-end gap-2 border-t border-gray-100 pt-3">
                                        <button pButton type="button" label="Schedule Meeting" icon="pi pi-calendar" class="p-button-info p-button-sm" (click)="scheduleMeeting(proposal)"></button>
                                        <button pButton type="button" label="View Details" icon="pi pi-eye" class="p-button-secondary p-button-sm" (click)="viewDetails(proposal)"></button>
                                    </div>
                                </div>
                            </div>
                        </p-scrollPanel>
                    </div>
                </div>

                <!-- Meeting Scheduled Status Section -->
                <div class="bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col min-w-[300px]">
                    <div class="p-4 bg-white rounded-t-lg border-b border-gray-100">
                        <div class="flex items-center justify-between mb-2">
                            <div class="flex items-center">
                                <i class="pi pi-calendar mr-2 text-blue-500"></i>
                                <h3 class="text-lg font-medium">Meeting Scheduled</h3>
                            </div>
                            <span class="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full">{{ getProposalsByStatus(ProposalStatus.MEETING_SCHEDULED).length }}</span>
                        </div>
                        <div class="border-b border-gray-200"></div>
                    </div>

                    <div class="flex-1 overflow-hidden">
                        <p-scrollPanel [style]="{ width: '100%', height: '70vh' }" styleClass="!border-none">
                            <div *ngIf="getProposalsByStatus(ProposalStatus.MEETING_SCHEDULED).length === 0" class="flex flex-col items-center justify-center p-6 text-center bg-gray-50 rounded-lg m-4">
                                <i class="pi pi-inbox text-4xl text-gray-300 mb-2"></i>
                                <p class="text-gray-500">No scheduled meetings</p>
                            </div>

                            <div *ngFor="let proposal of getProposalsByStatus(ProposalStatus.MEETING_SCHEDULED)" class="m-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                                <div class="flex justify-between items-center p-3 bg-blue-50 border-b border-blue-200 rounded-t-xl">
                                    <div class="flex items-center">
                                        <span class="font-medium">Proposal #{{ proposal.id }}</span>
                                    </div>
                                    <span class="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded">MEETING SCHEDULED</span>
                                </div>

                                <div class="p-4">
                                    <div class="grid grid-cols-2 gap-4 mb-3">
                                        <div>
                                            <p class="text-sm text-gray-500 mb-1">Company:</p>
                                            <p class="font-medium">{{ proposal.companyId }}</p>
                                        </div>
                                        <div>
                                            <p class="text-sm text-gray-500 mb-1">Student:</p>
                                            <p class="font-medium">{{ proposal.studentId }}</p>
                                        </div>
                                    </div>

                                    <div class="mb-4">
                                        <p class="text-sm text-gray-500 mb-1">Message:</p>
                                        <p class="text-gray-700 text-sm">{{ truncateText(proposal.message, 100) }}</p>
                                    </div>

                                    <div class="flex justify-end gap-2 border-t border-gray-100 pt-3">
                                        <button pButton type="button" label="Pass" icon="pi pi-check-circle" class="p-button-success p-button-sm" (click)="passProposal(proposal)"></button>
                                        <button pButton type="button" label="Fail" icon="pi pi-times-circle" class="p-button-danger p-button-sm" (click)="failProposal(proposal)"></button>
                                    </div>
                                </div>
                            </div>
                        </p-scrollPanel>
                    </div>
                </div>

                <!-- Other Final Statuses Section -->
                <div class="bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col min-w-[300px]">
                    <div class="p-4 bg-white rounded-t-lg border-b border-gray-100">
                        <div class="flex items-center justify-between mb-2">
                            <div class="flex items-center">
                                <i class="pi pi-flag mr-2 text-gray-500"></i>
                                <h3 class="text-lg font-medium">Other Final Statuses</h3>
                            </div>
                            <span class="bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-full">{{ getOtherFinalStatusProposalsCount() }}</span>
                        </div>
                        <div class="border-b border-gray-200"></div>
                    </div>

                    <div class="flex-1 overflow-hidden">
                        <p-scrollPanel [style]="{ width: '100%', height: '70vh' }" styleClass="!border-none">
                            <div *ngIf="getOtherFinalStatusProposals().length === 0" class="flex flex-col items-center justify-center p-6 text-center bg-gray-50 rounded-lg m-4">
                                <i class="pi pi-inbox text-4xl text-gray-300 mb-2"></i>
                                <p class="text-gray-500">No other final status proposals</p>
                            </div>

                            <div *ngFor="let proposal of getOtherFinalStatusProposals()" class="m-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                                <div
                                    class="flex justify-between items-center p-3 rounded-t-xl border-b"
                                    [ngClass]="{
                                        'bg-red-50 border-red-200': proposal.status === ProposalStatus.DECLINED || proposal.status === ProposalStatus.FAILED || proposal.status === ProposalStatus.STUDENT_REJECTED,
                                        'bg-green-50 border-green-200': proposal.status === ProposalStatus.STUDENT_ACCEPTED,
                                        'bg-gray-50 border-gray-200':
                                            proposal.status !== ProposalStatus.DECLINED && proposal.status !== ProposalStatus.FAILED && proposal.status !== ProposalStatus.STUDENT_REJECTED && proposal.status !== ProposalStatus.STUDENT_ACCEPTED
                                    }"
                                >
                                    <div class="flex items-center">
                                        <span class="font-medium">Proposal #{{ proposal.id }}</span>
                                    </div>
                                    <span
                                        class="text-xs px-2.5 py-0.5 rounded"
                                        [ngClass]="{
                                            'bg-red-100 text-red-800': proposal.status === ProposalStatus.DECLINED || proposal.status === ProposalStatus.FAILED || proposal.status === ProposalStatus.STUDENT_REJECTED,
                                            'bg-green-100 text-green-800': proposal.status === ProposalStatus.STUDENT_ACCEPTED,
                                            'bg-gray-100 text-gray-800':
                                                proposal.status !== ProposalStatus.DECLINED && proposal.status !== ProposalStatus.FAILED && proposal.status !== ProposalStatus.STUDENT_REJECTED && proposal.status !== ProposalStatus.STUDENT_ACCEPTED
                                        }"
                                        >{{ proposal.status }}</span
                                    >
                                </div>

                                <div class="p-4">
                                    <div class="grid grid-cols-2 gap-4 mb-3">
                                        <div>
                                            <p class="text-sm text-gray-500 mb-1">Company:</p>
                                            <p class="font-medium">{{ proposal.companyId }}</p>
                                        </div>
                                        <div>
                                            <p class="text-sm text-gray-500 mb-1">Student:</p>
                                            <p class="font-medium">{{ proposal.studentId }}</p>
                                        </div>
                                    </div>

                                    <div class="mb-3">
                                        <p class="text-sm text-gray-500 mb-1">Message:</p>
                                        <p class="text-gray-700 text-sm">{{ truncateText(proposal.message, 100) }}</p>
                                    </div>

                                    <div class="mb-4">
                                        <p class="text-sm text-gray-500 mb-1">Final Status:</p>
                                        <p class="text-gray-700 text-sm">{{ proposal.status }}</p>
                                    </div>

                                    <div class="flex justify-end gap-2 border-t border-gray-100 pt-3">
                                        <button pButton type="button" label="View Details" icon="pi pi-eye" class="p-button-secondary p-button-sm" (click)="viewDetails(proposal)"></button>
                                    </div>
                                </div>
                            </div>
                        </p-scrollPanel>
                    </div>
                </div>
            </div>
        </div>

        <!-- Meeting Dialog -->
        <p-dialog header="Schedule Meeting" [(visible)]="meetingDialogVisible" [modal]="true" [style]="{ width: '450px', minHeight: '600px' }" [draggable]="false" [resizable]="false" styleClass="rounded-lg shadow-lg">
            <div class="space-y-4">
                <div class="field">
                    <label for="meetingDateTime" class="block text-gray-700 font-medium mb-2">Meeting Date & Time</label>
                    <p-calendar 
                        id="meetingDateTime"
                        [(ngModel)]="meetingDateTime" 
                        [showTime]="true" 
                        [minDate]="minDate"
                        [showButtonBar]="true"
                        [showIcon]="true"
                        [hourFormat]="24"
                        dateFormat="dd/mm/yy"
                        placeholder="Select date and time"
                        class="w-full"
                        [style]="{'width': '100%'}"
                    ></p-calendar>
                </div>
                <div class="field">
                    <label for="message" class="block text-gray-700 font-medium mb-2">Meeting Details</label>
                    <textarea 
                        id="message" 
                        pInputTextarea 
                        [(ngModel)]="meetingDetails" 
                        rows="5" 
                        class="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter meeting details..."
                    ></textarea>
                </div>
            </div>
            <ng-template pTemplate="footer">
                <div class="flex justify-end gap-2 border-t border-gray-200 pt-3">
                    <button pButton type="button" label="Cancel" icon="pi pi-times" class="p-button-text" (click)="meetingDialogVisible = false"></button>
                    <button pButton type="button" label="Schedule" icon="pi pi-calendar-plus" class="p-button-success" (click)="confirmScheduleMeeting()"></button>
                </div>
            </ng-template>
        </p-dialog>

        <!-- Details Dialog -->
        <p-dialog header="Proposal Details" [(visible)]="detailsDialogVisible" [modal]="true" [style]="{ width: '500px' }" [draggable]="false" [resizable]="false" styleClass="rounded-lg shadow-lg">
            <div *ngIf="selectedProposal" class="space-y-4">
                <div class="flex items-center justify-between">
                    <h6 class="text-lg font-medium">Proposal #{{ selectedProposal.id }}</h6>
                    <span
                        [ngClass]="{
                            'bg-yellow-100 text-yellow-800': selectedProposal.status === ProposalStatus.PENDING,
                            'bg-green-100 text-green-800': selectedProposal.status === ProposalStatus.ACCEPTED || selectedProposal.status === ProposalStatus.PASSED || selectedProposal.status === ProposalStatus.STUDENT_ACCEPTED,
                            'bg-red-100 text-red-800': selectedProposal.status === ProposalStatus.DECLINED || selectedProposal.status === ProposalStatus.FAILED || selectedProposal.status === ProposalStatus.STUDENT_REJECTED,
                            'bg-blue-100 text-blue-800': selectedProposal.status === ProposalStatus.MEETING_SCHEDULED
                        }"
                        class="text-xs px-2.5 py-0.5 rounded"
                        >{{ selectedProposal.status }}</span
                    >
                </div>
                <div class="border-b border-gray-200"></div>
                <div class="space-y-4">
                    <div>
                        <span class="font-semibold block mb-1 text-gray-700">Company ID:</span>
                        <span class="text-gray-800">{{ selectedProposal.companyId }}</span>
                    </div>
                    <div>
                        <span class="font-semibold block mb-1 text-gray-700">Student ID:</span>
                        <span class="text-gray-800">{{ selectedProposal.studentId }}</span>
                    </div>
                    <div>
                        <span class="font-semibold block mb-1 text-gray-700">Created At:</span>
                        <span class="text-gray-800">{{ selectedProposal.createdAt | date: 'medium' }}</span>
                    </div>
                    <div *ngIf="selectedProposal.respondedAt">
                        <span class="font-semibold block mb-1 text-gray-700">Responded At:</span>
                        <span class="text-gray-800">{{ selectedProposal.respondedAt | date: 'medium' }}</span>
                    </div>
                    <div>
                        <span class="font-semibold block mb-1 text-gray-700">Message:</span>
                        <p class="text-gray-800">{{ selectedProposal.message }}</p>
                    </div>
                    <div *ngIf="selectedProposal.technicalTest !== null">
                        <span class="font-semibold block mb-1 text-gray-700">Technical Test:</span>
                        <p *ngIf="selectedProposal.technicalTest" class="text-gray-800">Available</p>
                        <p *ngIf="!selectedProposal.technicalTest" class="text-gray-800">Not Available</p>
                    </div>
                </div>
            </div>
            <ng-template pTemplate="footer">
                <div class="flex justify-end gap-2 border-t border-gray-200 pt-3">
                    <button pButton type="button" label="Close" icon="pi pi-times" class="p-button-text" (click)="detailsDialogVisible = false"></button>
                </div>
            </ng-template>
        </p-dialog>

        <p-toast></p-toast>
        <p-confirmDialog header="Confirmation" icon="pi pi-exclamation-triangle"></p-confirmDialog>
    `,
    styles: []
})
export class ManageProposalsComponent implements OnInit {
    proposals: Proposal[] = [];
    loading: boolean = true;
    ProposalStatus = ProposalStatus; // Expose enum to template

    // Dialog control
    meetingDialogVisible: boolean = false;
    detailsDialogVisible: boolean = false;
    meetingDetails: string = '';
    selectedProposal: Proposal | null = null;
    meetingDateTime: Date | null = null;
    minDate: Date = new Date();

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
        this.proposalService.getAllProposals().subscribe({
            next: (data) => {
                this.proposals = data;
                this.loading = false;
            },
            error: (error: HttpErrorResponse) => {
                console.error('Error loading proposals:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.status === 0 ? 'Could not connect to the server. Please check if the backend is running.' : `Failed to load proposals: ${error.message || 'Unknown error'}`
                });
                this.loading = false;
                this.proposals = [];
            }
        });
    }

    getProposalsByStatus(status: ProposalStatus): Proposal[] {
        return this.proposals.filter((proposal) => proposal.status === status);
    }

    getOtherFinalStatusProposals(): Proposal[] {
        const finalStatuses = [ProposalStatus.FAILED, ProposalStatus.DECLINED, ProposalStatus.STUDENT_ACCEPTED, ProposalStatus.STUDENT_REJECTED];
        return this.proposals.filter((proposal) => finalStatuses.includes(proposal.status));
    }

    getOtherFinalStatusProposalsCount(): number {
        return this.getOtherFinalStatusProposals().length;
    }

    getStatusSeverity(status: ProposalStatus): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
        switch (status) {
            case ProposalStatus.ACCEPTED:
            case ProposalStatus.PASSED:
            case ProposalStatus.STUDENT_ACCEPTED:
                return 'success';
            case ProposalStatus.DECLINED:
            case ProposalStatus.FAILED:
            case ProposalStatus.STUDENT_REJECTED:
                return 'danger';
            case ProposalStatus.PENDING:
                return 'warn';
            case ProposalStatus.MEETING_SCHEDULED:
                return 'info';
            default:
                return 'secondary';
        }
    }

    onAcceptProposal(proposal: Proposal) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to accept this proposal?',
            accept: () => {
                this.proposalService.acceptProposal(proposal.id).subscribe({
                    next: (response) => {
                        proposal.status = ProposalStatus.ACCEPTED;
                        proposal.respondedAt = new Date().toISOString();
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: response.message || 'Proposal accepted successfully'
                        });
                        this.loadProposals();
                    },
                    error: (error: HttpErrorResponse) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: `Failed to accept proposal: ${error.message}`
                        });
                    }
                });
            }
        });
    }

    onDeclineProposal(proposal: Proposal) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to decline this proposal?',
            accept: () => {
                this.proposalService.declineProposal(proposal.id).subscribe({
                    next: (response) => {
                        proposal.status = ProposalStatus.DECLINED;
                        proposal.respondedAt = new Date().toISOString();
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: response.message || 'Proposal declined successfully'
                        });
                        this.loadProposals();
                    },
                    error: (error: HttpErrorResponse) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: `Failed to decline proposal: ${error.message}`
                        });
                    }
                });
            }
        });
    }

    scheduleMeeting(proposal: Proposal) {
        this.selectedProposal = proposal;
        this.meetingDetails = '';
        this.meetingDateTime = null;
        this.meetingDialogVisible = true;
    }

    confirmScheduleMeeting() {
        if (!this.selectedProposal || !this.meetingDateTime) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please select a date and time for the meeting'
            });
            return;
        }

        const proposal = this.selectedProposal;
        const formattedDateTime = this.meetingDateTime.toISOString();

        this.proposalService.scheduleMeeting(proposal.id, this.meetingDetails, formattedDateTime).subscribe({
            next: (response) => {
                proposal.status = ProposalStatus.MEETING_SCHEDULED;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Interview invitation sent successfully and meeting scheduled'
                });
                this.meetingDialogVisible = false;
                this.meetingDetails = '';
                this.meetingDateTime = null;
                this.selectedProposal = null;
                this.loadProposals();
            },
            error: (error: HttpErrorResponse) => {
                console.error('Error scheduling meeting:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: `Failed to schedule meeting: ${error.message || 'Unknown error'}`
                });
            }
        });
    }

    passProposal(proposal: Proposal) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to mark this proposal as PASSED?',
            accept: () => {
                this.proposalService.updateProposalStatus(proposal.id, ProposalStatus.PASSED).subscribe({
                    next: (response) => {
                        proposal.status = ProposalStatus.PASSED;
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: response.message || 'Proposal marked as PASSED'
                        });
                        this.loadProposals();
                    },
                    error: (error: HttpErrorResponse) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: `Failed to update proposal status: ${error.message}`
                        });
                    }
                });
            }
        });
    }

    failProposal(proposal: Proposal) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to mark this proposal as FAILED?',
            accept: () => {
                this.proposalService.updateProposalStatus(proposal.id, ProposalStatus.FAILED).subscribe({
                    next: (response) => {
                        proposal.status = ProposalStatus.FAILED;
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: response.message || 'Proposal marked as FAILED'
                        });
                        this.loadProposals();
                    },
                    error: (error: HttpErrorResponse) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: `Failed to update proposal status: ${error.message}`
                        });
                    }
                });
            }
        });
    }

    viewDetails(proposal: Proposal) {
        this.selectedProposal = proposal;
        this.detailsDialogVisible = true;
    }

    truncateText(text: string, maxLength: number): string {
        if (!text) return '';

        if (text.length <= maxLength) {
            return text;
        }

        return text.substring(0, maxLength) + '...';
    }
}
