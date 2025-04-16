import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NoteService } from '../../../services/note.service';

export interface Note {
    id?: number; // Add optional id field
    lessonId: number;
    courseId: number;
    content: string;
    timestamp: Date;
    color: string;
}

@Component({
    selector: 'app-note-panel',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
        <div class="note-panel">
            <div class="note-header">
                <h5>Notes for: {{ lessonTitle }}</h5>
                <div class="note-colors">
                    <div *ngFor="let color of noteColors" class="color-dot" [ngStyle]="{ 'background-color': color }" [ngClass]="{ selected: selectedColor === color }" (click)="selectColor(color)"></div>
                </div>
            </div>
            <textarea [(ngModel)]="noteContent" placeholder="Take your notes here..." class="note-textarea" [ngStyle]="{ 'border-color': selectedColor }"> </textarea>
            <div class="note-actions">
                <button class="cancel-button" (click)="cancel()">Cancel</button>
                <button class="save-button" (click)="save()" [disabled]="isSaving">
                    <span *ngIf="isSaving">Saving...</span>
                    <span *ngIf="!isSaving">Save Note</span>
                </button>
            </div>

            <!-- Previous notes -->
            <div *ngIf="notes.length > 0" class="previous-notes">
                <h6>Previous Notes</h6>
                <div *ngFor="let note of notes; let i = index" class="note-card" [ngStyle]="{ 'border-left-color': note.color }">
                    <div class="note-content">{{ note.content }}</div>
                    <div class="note-footer">
                        <span class="note-timestamp">{{ note.timestamp | date: 'short' }}</span>
                        <button class="delete-note" (click)="deleteNote(i)" [disabled]="isDeleting">
                            <svg *ngIf="!isDeleting" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M3 6h18"></path>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                                <path d="M8 6V4a2 2 0 0 1-2-2h4a2 2 0 0 1-2 2v2"></path>
                            </svg>
                            <span *ngIf="isDeleting">...</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [
        `
            .note-panel {
                background: #fff;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
                padding: 16px;
                margin: 16px 0;
                border: 1px solid #e2e8f0;
            }

            .note-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;
            }

            .note-header h5 {
                font-size: 16px;
                margin: 0;
                color: #2d3748;
            }

            .note-colors {
                display: flex;
                gap: 6px;
            }

            .color-dot {
                width: 18px;
                height: 18px;
                border-radius: 50%;
                cursor: pointer;
                transition: transform 0.15s;
            }

            .color-dot:hover {
                transform: scale(1.2);
            }

            .color-dot.selected {
                box-shadow:
                    0 0 0 2px white,
                    0 0 0 4px currentColor;
            }

            .note-textarea {
                width: 100%;
                min-height: 120px;
                padding: 12px;
                border: 1px solid #e2e8f0;
                border-radius: 6px;
                font-family: inherit;
                font-size: 14px;
                margin-bottom: 12px;
                resize: vertical;
                transition: border-color 0.2s;
            }

            .note-textarea:focus {
                outline: none;
                border-color: #4299e1;
            }

            .note-actions {
                display: flex;
                justify-content: flex-end;
                gap: 8px;
            }

            .cancel-button,
            .save-button {
                padding: 6px 12px;
                border-radius: 4px;
                font-size: 14px;
                cursor: pointer;
            }

            .cancel-button {
                background: none;
                border: 1px solid #cbd5e0;
                color: #4a5568;
            }

            .save-button {
                background: #4299e1;
                border: none;
                color: white;
            }

            .cancel-button:hover {
                background: #f7fafc;
            }

            .save-button:hover {
                background: #3182ce;
            }

            .previous-notes {
                margin-top: 16px;
                border-top: 1px solid #e2e8f0;
                padding-top: 12px;
            }

            .previous-notes h6 {
                font-size: 14px;
                margin-bottom: 10px;
                color: #4a5568;
            }

            .note-card {
                background: #f8fafc;
                border-radius: 6px;
                padding: 12px;
                margin-bottom: 8px;
                border-left: 4px solid #4299e1;
                font-size: 14px;
            }

            .note-content {
                color: #4a5568;
                white-space: pre-wrap;
            }

            .note-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 8px;
                font-size: 12px;
                color: #718096;
            }

            .delete-note {
                background: none;
                border: none;
                color: #a0aec0;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 4px;
                border-radius: 4px;
            }

            .delete-note:hover {
                color: #e53e3e;
                background: #fff5f5;
            }

            @media (prefers-color-scheme: dark) {
                .note-panel {
                    background: #1a202c;
                    border-color: #2d3748;
                }

                .note-header h5 {
                    color: #e2e8f0;
                }

                .note-textarea {
                    background: #2d3748;
                    border-color: #4a5568;
                    color: #e2e8f0;
                }

                .note-card {
                    background: #2d3748;
                }

                .note-content {
                    color: #e2e8f0;
                }

                .cancel-button {
                    border-color: #4a5568;
                    color: #e2e8f0;
                }

                .cancel-button:hover {
                    background: #2d3748;
                }
            }
        `
    ]
})
export class NotePanelComponent implements OnInit {
    @Input() lessonId!: number;
    @Input() courseId!: number;
    @Input() lessonTitle: string = '';

    notes: Note[] = [];

    @Output() cancelEvent = new EventEmitter<void>();

    noteContent: string = '';
    selectedColor: string = '#4299e1'; // Default color
    isSaving: boolean = false;
    isDeleting: boolean = false;
    isLoading: boolean = false;

    noteColors: string[] = [
        '#4299e1', // Blue
        '#48bb78', // Green
        '#ed8936', // Orange
        '#ed64a6', // Pink
        '#9f7aea' // Purple
    ];

    constructor(private noteService: NoteService) {}

    ngOnInit(): void {
        this.loadNotes();
    }

    loadNotes(): void {
        if (this.courseId && this.lessonId) {
            this.isLoading = true;
            this.noteService.getNotesByCourseAndLessonId(this.courseId, this.lessonId).subscribe({
                next: (apiNotes) => {
                    this.notes = apiNotes.map((note) => this.noteService.convertToAppNote(note));
                    this.isLoading = false;
                },
                error: (error) => {
                    console.error('Error loading notes:', error);
                    this.isLoading = false;
                }
            });
        }
    }

    selectColor(color: string): void {
        this.selectedColor = color;
    }

    save(): void {
        if (!this.noteContent.trim() || this.isSaving) return;

        const newNote: Note = {
            lessonId: this.lessonId,
            courseId: this.courseId,
            content: this.noteContent,
            timestamp: new Date(),
            color: this.selectedColor
        };

        this.isSaving = true;
        this.noteService.createNote(this.courseId, this.lessonId, newNote).subscribe({
            next: (createdNote) => {
                this.notes.push(this.noteService.convertToAppNote(createdNote));
                this.noteContent = '';
                this.isSaving = false;
                console.log('Note saved successfully:', createdNote);
            },
            error: (error) => {
                console.error('Error saving note:', error);
                this.isSaving = false;
            }
        });
    }

    cancel(): void {
        this.cancelEvent.emit();
    }

    deleteNote(index: number): void {
        if (this.isDeleting) return;

        const noteToDelete = (this.notes[index] as any).id;

        if (!noteToDelete) {
            console.error('Cannot delete note: Missing ID');
            return;
        }

        this.isDeleting = true;
        this.noteService.deleteNote(noteToDelete).subscribe({
            next: () => {
                this.notes.splice(index, 1);
                this.isDeleting = false;
                console.log('Note deleted successfully');
            },
            error: (error) => {
                console.error('Error deleting note:', error);
                this.isDeleting = false;
            }
        });
    }
}
