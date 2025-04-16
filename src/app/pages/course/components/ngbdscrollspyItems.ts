import { Component, Input } from '@angular/core';
import { NgbScrollSpyModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { CourseType } from '../../../models/course.model';
import { ViewportScroller } from '@angular/common';
import { NgbdAccordionToggle } from './ngbdAccordiontoggle';
import { LessonContentComponent } from './lesson-content.component';
import { LessonNavigationComponent } from './lesson-navigation.component';
import { Note } from './note-panel.component';

@Component({
    selector: 'ngbd-scrollspy-items',
    standalone: true,
    imports: [NgbScrollSpyModule, CommonModule, NgbdAccordionToggle, LessonContentComponent, LessonNavigationComponent],
    template: `
        <div class="content-wrapper">
            <div class="main-content">
                <div ngbScrollSpy #spy="ngbScrollSpy" [rootMargin]="'-100px'" class="content-section p-3 rounded-2">
                    <app-lesson-content
                        *ngFor="let lesson of course?.lessons; let i = index"
                        [lesson]="lesson"
                        [index]="i"
                        [courseId]="course?.id!"
                        [notes]="getNotesForLesson(lesson.id)"
                        [hasNotes]="hasNotesForLesson(lesson.id)"
                        (saveNoteEvent)="saveNote($event)"
                        (deleteNoteEvent)="handleDeleteNote($event)"
                    >
                    </app-lesson-content>
                </div>
            </div>

            <app-lesson-navigation [lessons]="course?.lessons || []" [spy]="spy" [lessonNotesMap]="createLessonNotesMap()" (lessonSelected)="scrollToLesson($event)"> </app-lesson-navigation>
        </div>
    `,
    styles: [
        `
            .content-wrapper {
                display: flex;
                gap: 2rem;
                position: relative;
            }

            .main-content {
                flex: 1;
            }

            .content-section {
                font-family:
                    'Segoe UI',
                    system-ui,
                    -apple-system,
                    sans-serif;
                font-size: 1.1rem;
                line-height: 1.8;
                color: #2d3748;
                max-width: 800px;
                margin: 0 auto;
                scrollbar-width: thin;
                scrollbar-color: #cbd5e0 #f7fafc;
            }

            .content-section::-webkit-scrollbar {
                width: 8px;
            }

            .content-section::-webkit-scrollbar-track {
                background: #f7fafc;
                border-radius: 10px;
            }

            .content-section::-webkit-scrollbar-thumb {
                background-color: #cbd5e0;
                border-radius: 10px;
                border: 2px solid #f7fafc;
                transition: background-color 0.3s ease;
            }

            .content-section::-webkit-scrollbar-thumb:hover {
                background-color: #a0aec0;
            }

            @media (prefers-color-scheme: dark) {
                .content-section {
                    color: #e2e8f0;
                    scrollbar-color: #4a5568 #1a202c;
                }

                .content-section::-webkit-scrollbar-track {
                    background: #1a202c;
                }

                .content-section::-webkit-scrollbar-thumb {
                    background-color: #4a5568;
                    border: 2px solid #1a202c;
                }

                .content-section::-webkit-scrollbar-thumb:hover {
                    background-color: #718096;
                }
            }

            @media (max-width: 768px) {
                .content-wrapper {
                    flex-direction: column;
                }
            }
        `
    ]
})
export class NgbdScrollSpyItems {
    @Input() course?: CourseType;
    notes: Note[] = [];

    constructor(private viewportScroller: ViewportScroller) {
        // Enable smooth scrolling behavior
        this.viewportScroller.setOffset([0, 20]);

        // Check for existing notes in localStorage
        const savedNotes = localStorage.getItem('courseNotes');
        if (savedNotes) {
            this.notes = JSON.parse(savedNotes);
        }
    }

    scrollToLesson(elementId: string): void {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest'
            });
        }
    }

    saveNote(note: Note): void {
        // Add the note to the array
        this.notes.push(note);

        // Save to localStorage
        localStorage.setItem('courseNotes', JSON.stringify(this.notes));

        // Console log for the requirement
        console.log('Note saved:', note);
    }

    getNotesForLesson(lessonId: number): Note[] {
        return this.notes.filter((note) => note.lessonId === lessonId);
    }

    hasNotesForLesson(lessonId: number): boolean {
        return this.notes.some((note) => note.lessonId === lessonId);
    }

    createLessonNotesMap(): Map<number, boolean> {
        const map = new Map<number, boolean>();
        if (this.course?.lessons) {
            for (const lesson of this.course.lessons) {
                map.set(lesson.id, this.hasNotesForLesson(lesson.id));
            }
        }
        return map;
    }

    handleDeleteNote(event: { lessonId: number; index: number }): void {
        const lessonNotes = this.getNotesForLesson(event.lessonId);
        if (lessonNotes[event.index]) {
            // Find the actual index in the main notes array
            const noteToDelete = lessonNotes[event.index];
            const mainIndex = this.notes.findIndex((n) => n.lessonId === noteToDelete.lessonId && n.content === noteToDelete.content && n.timestamp.toString() === noteToDelete.timestamp.toString());

            if (mainIndex !== -1) {
                this.notes.splice(mainIndex, 1);
                localStorage.setItem('courseNotes', JSON.stringify(this.notes));
                console.log('Note deleted:', noteToDelete);
            }
        }
    }
}
