import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

import { CommonModule } from '@angular/common';
import { CourseType } from '../../../models/course.model';
import { ViewportScroller } from '@angular/common';
import { NgbdAccordionToggle } from './ngbdAccordiontoggle';
import { LessonContentComponent } from './lesson-content.component';
import { LessonNavigationComponent } from './lesson-navigation.component';
import { Note } from './note-panel.component';
import { NoteService } from '../../../services/note.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NgbScrollSpyModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'ngbd-scrollspy-items',
    standalone: true,
    imports: [NgbScrollSpyModule, CommonModule, LessonContentComponent, LessonNavigationComponent],
    template: `
        <div class="content-wrapper">
            <div class="main-content">
                <div ngbScrollSpy #spy="ngbScrollSpy" [rootMargin]="'-100px'" class="content-section p-3 rounded-2">
                    <app-lesson-content *ngFor="let lesson of course?.lessons; let i = index" [lesson]="lesson" [index]="i" [courseId]="course?.id!"> </app-lesson-content>
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
export class NgbdScrollSpyItems implements OnInit, OnChanges {
    @Input() course?: CourseType;
    notes: Note[] = [];
    notesMap: Map<number, Note[]> = new Map();
    isLoading: boolean = false;

    constructor(
        private viewportScroller: ViewportScroller,
        private noteService: NoteService
    ) {
        // Enable smooth scrolling behavior
        this.viewportScroller.setOffset([0, 20]);
    }

    ngOnInit(): void {
        if (this.course?.id) {
            this.loadAllNotes();
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        // Reload notes when the course changes
        if (changes['course'] && !changes['course'].firstChange && this.course?.id) {
            this.loadAllNotes();
        }
    }

    loadAllNotes(): void {
        if (!this.course?.id || !this.course.lessons || this.course.lessons.length === 0) return;

        this.isLoading = true;
        this.notes = [];
        this.notesMap.clear();

        // Create an observable for each lesson to get its notes
        const lessonRequests = this.course.lessons.map((lesson) =>
            this.noteService.getNotesByCourseAndLessonId(this.course!.id!, lesson.id).pipe(
                catchError((error) => {
                    console.error(`Error loading notes for lesson ${lesson.id}:`, error);
                    return of([]); // Return empty array on error to continue
                })
            )
        );

        // Execute all requests in parallel
        forkJoin(lessonRequests).subscribe({
            next: (lessonNotesArrays) => {
                // Process notes for each lesson
                lessonNotesArrays.forEach((apiNotes, index) => {
                    if (apiNotes.length > 0) {
                        const lessonId = this.course!.lessons[index].id;

                        // Convert API notes to app notes
                        const convertedNotes = apiNotes.map((note) => this.noteService.convertToAppNote(note));

                        // Add to the notes collection
                        this.notes.push(...convertedNotes);

                        // Store in the map by lesson ID
                        this.notesMap.set(lessonId, convertedNotes);
                    }
                });

                this.isLoading = false;
                console.log('All notes loaded for course and lessons');
            },
            error: (error) => {
                console.error('Error loading notes:', error);
                this.isLoading = false;
            }
        });
    }

    organizeNotesByLesson(): void {
        this.notesMap.clear();

        for (const note of this.notes) {
            const lessonNotes = this.notesMap.get(note.lessonId) || [];
            lessonNotes.push(note);
            this.notesMap.set(note.lessonId, lessonNotes);
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
        this.noteService.createNote(note.courseId, note.lessonId, note).subscribe({
            next: (createdNote) => {
                // Add the converted note to our local array
                const newNote = this.noteService.convertToAppNote(createdNote);
                this.notes.push(newNote);

                // Update the lessons map
                const lessonNotes = this.notesMap.get(note.lessonId) || [];
                lessonNotes.push(newNote);
                this.notesMap.set(note.lessonId, lessonNotes);

                console.log('Note saved:', newNote);
            },
            error: (error) => {
                console.error('Error saving note:', error);
            }
        });
    }

    getNotesForLesson(lessonId: number): Note[] {
        return this.notesMap.get(lessonId) || [];
    }

    hasNotesForLesson(lessonId: number): boolean {
        const lessonNotes = this.notesMap.get(lessonId);
        return lessonNotes !== undefined && lessonNotes.length > 0;
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
            const noteToDelete = lessonNotes[event.index];

            // Check if the note has an id (using optional chaining for safety)
            if (noteToDelete?.id) {
                this.noteService.deleteNote(noteToDelete.id).subscribe({
                    next: () => {
                        // Remove from our arrays after successful deletion
                        const mainIndex = this.notes.findIndex((n) => n.id === noteToDelete.id);

                        if (mainIndex !== -1) {
                            this.notes.splice(mainIndex, 1);
                        }

                        // Update the lesson map
                        lessonNotes.splice(event.index, 1);
                        this.notesMap.set(event.lessonId, lessonNotes);

                        console.log('Note deleted:', noteToDelete);
                    },
                    error: (error) => {
                        console.error('Error deleting note:', error);
                    }
                });
            } else {
                console.error('Cannot delete note: Missing ID');

                // Even though we can't delete on the server, we might want to remove it locally
                // if this is a temporary/unsaved note
                lessonNotes.splice(event.index, 1);
                this.notesMap.set(event.lessonId, lessonNotes);
            }
        }
    }
}
