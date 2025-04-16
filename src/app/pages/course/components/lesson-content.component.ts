import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LessonType } from '../../../models/course.model';
import { NgbdAccordionToggle } from './ngbdAccordiontoggle';
import { NgbScrollSpyModule } from '@ng-bootstrap/ng-bootstrap';
import { NotePanelComponent, Note } from './note-panel.component';

@Component({
    selector: 'app-lesson-content',
    standalone: true,
    imports: [CommonModule, NgbdAccordionToggle, NgbScrollSpyModule, NotePanelComponent],
    template: `
        <div [id]="'lesson-' + index" [ngbScrollSpyFragment]="'lesson-' + index" class="lesson-container">
            <div class="lesson-header">
                <h4>{{ lesson.title }}</h4>
                <button class="note-button" [ngClass]="{ 'has-notes': hasNotes }" (click)="toggleNotePanel()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 20h9"></path>
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                    </svg>
                </button>
            </div>

            <div class="lesson-content">
                <p>{{ lesson.content }}</p>
            </div>

            <app-note-panel *ngIf="isNotePanelOpen" [lessonId]="lesson.id" [lessonTitle]="lesson.title" [notes]="notes" (saveNoteEvent)="saveNote($event)" (deleteNoteEvent)="deleteNote($event)" (cancelEvent)="toggleNotePanel()"> </app-note-panel>

            <ngbd-accordion-toggle [courseId]="courseId" [lessonId]="lesson.id"></ngbd-accordion-toggle>
        </div>
    `,
    styles: [
        `
            .lesson-container {
                padding: 1rem;
            }

            .lesson-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .lesson-content {
                margin-bottom: 1.5rem;
            }

            h4 {
                font-size: 1.75rem;
                font-weight: 600;
                color: #1a202c;
                margin-top: 1rem;
                margin-bottom: 1.5rem;
            }

            p {
                margin-bottom: 2rem;
                letter-spacing: 0.01em;
                line-height: 1.8;
            }

            .note-button {
                background: none;
                border: 1px solid #e2e8f0;
                color: #718096;
                border-radius: 50%;
                width: 34px;
                height: 34px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.2s;
            }

            .note-button:hover {
                background: #f7fafc;
                color: #4a5568;
                transform: scale(1.05);
            }

            .note-button.has-notes {
                background: #ebf4ff;
                color: #4299e1;
                border-color: #bee3f8;
            }

            @media (prefers-color-scheme: dark) {
                h4 {
                    color: #f7fafc;
                }

                .note-button {
                    border-color: #4a5568;
                    color: #a0aec0;
                }

                .note-button:hover {
                    background: #2d3748;
                    color: #e2e8f0;
                }
            }
        `
    ]
})
export class LessonContentComponent {
    @Input() lesson!: LessonType;
    @Input() index!: number;
    @Input() courseId!: number;
    @Input() notes: Note[] = [];
    @Input() hasNotes: boolean = false;

    @Output() saveNoteEvent = new EventEmitter<Note>();
    @Output() deleteNoteEvent = new EventEmitter<{ lessonId: number; index: number }>();

    isNotePanelOpen: boolean = false;

    toggleNotePanel(): void {
        this.isNotePanelOpen = !this.isNotePanelOpen;
    }

    saveNote(note: Note): void {
        this.saveNoteEvent.emit(note);
    }

    deleteNote(index: number): void {
        this.deleteNoteEvent.emit({ lessonId: this.lesson.id, index });
    }
}
