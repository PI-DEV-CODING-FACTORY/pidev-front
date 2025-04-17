import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoteService } from '../../services/note.service';
import { CourseService } from '../../services/course.service';
import { Note } from '../course/components/note-panel.component';
import { HttpClientModule } from '@angular/common/http';
import { CourseType } from '../../models/course.model';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

interface NotesByCategory {
    courseName: string;
    courseId: number;
    lessons: {
        lessonName: string;
        lessonId: number;
        notes: Note[];
    }[];
}

@Component({
    selector: 'app-note',
    standalone: true,
    imports: [CommonModule, HttpClientModule],
    template: `
        <div class="notes-container">
            <h2>My Notes</h2>

            <div *ngIf="loading" class="loading">Loading notes...</div>

            <div *ngIf="error" class="error">
                {{ error }}
            </div>

            <div *ngIf="!loading && !error && organizedNotes.length === 0" class="empty-state">No notes found. Create your first note!</div>

            <div *ngFor="let courseNotes of organizedNotes" class="course-container">
                <h3 class="course-title">{{ courseNotes.courseName }}</h3>

                <div *ngFor="let lessonNotes of courseNotes.lessons" class="lesson-container">
                    <h4 class="lesson-title">{{ lessonNotes.lessonName }}</h4>

                    <div class="notes-grid">
                        <div *ngFor="let note of lessonNotes.notes" class="note-card" [style.border-top-color]="note.color">
                            <div class="note-header">
                                <span class="note-date">{{ note.timestamp | date: 'medium' }}</span>
                            </div>
                            <p class="note-content">{{ note.content }}</p>
                            <div class="note-actions">
                                <button (click)="editNote(note)" class="action-button edit">Edit</button>
                                <button (click)="note.id !== undefined && deleteNote(note.id)" class="action-button delete">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [
        `
            .notes-container {
                max-width: 1200px;
                margin: 0 auto;
                padding: 20px;
            }

            h2 {
                margin-bottom: 30px;
                color: #333;
                text-align: center;
                font-size: 28px;
            }

            .course-container {
                margin-bottom: 30px;
                background-color: #f5f7fa;
                border-radius: 8px;
                padding: 20px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
            }

            .course-title {
                color: #2c5282;
                font-size: 22px;
                margin-bottom: 15px;
                padding-bottom: 8px;
                border-bottom: 1px solid #e2e8f0;
            }

            .lesson-container {
                margin-bottom: 20px;
            }

            .lesson-title {
                color: #4a5568;
                font-size: 18px;
                margin-bottom: 10px;
                font-weight: 500;
            }

            .notes-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                gap: 20px;
            }

            .note-card {
                background-color: white;
                border-radius: 6px;
                padding: 15px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
                border-top: 4px solid #4299e1;
                display: flex;
                flex-direction: column;
                height: 100%;
                transition:
                    transform 0.2s ease,
                    box-shadow 0.2s ease;
            }

            .note-card:hover {
                transform: translateY(-3px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }

            .note-header {
                margin-bottom: 10px;
            }

            .note-date {
                font-size: 12px;
                color: #718096;
            }

            .note-content {
                flex-grow: 1;
                margin: 0 0 15px 0;
                font-size: 15px;
                color: #4a5568;
                line-height: 1.5;
            }

            .note-actions {
                display: flex;
                justify-content: flex-end;
                gap: 8px;
            }

            .action-button {
                padding: 6px 12px;
                border: none;
                border-radius: 4px;
                font-size: 12px;
                cursor: pointer;
                transition: background-color 0.2s;
            }

            .edit {
                background-color: #ebf4ff;
                color: #3182ce;
            }

            .edit:hover {
                background-color: #bee3f8;
            }

            .delete {
                background-color: #fff5f5;
                color: #e53e3e;
            }

            .delete:hover {
                background-color: #fed7d7;
            }

            .loading,
            .error,
            .empty-state {
                text-align: center;
                padding: 40px;
                background-color: #f8f9fa;
                border-radius: 8px;
                margin: 30px 0;
            }

            .loading {
                color: #4a5568;
            }

            .error {
                color: #e53e3e;
                background-color: #fff5f5;
            }

            .empty-state {
                color: #718096;
                font-size: 18px;
            }

            @media (prefers-color-scheme: dark) {
                h2,
                .lesson-title {
                    color: #e2e8f0;
                }

                .course-title {
                    color: #90cdf4;
                    border-bottom-color: #4a5568;
                }

                .course-container {
                    background-color: #2d3748;
                }

                .note-card {
                    background-color: #1a202c;
                }

                .note-date {
                    color: #a0aec0;
                }

                .note-content {
                    color: #e2e8f0;
                }

                .edit {
                    background-color: #2c5282;
                    color: #bee3f8;
                }

                .edit:hover {
                    background-color: #2b6cb0;
                }

                .delete {
                    background-color: #742a2a;
                    color: #feb2b2;
                }

                .delete:hover {
                    background-color: #9b2c2c;
                }

                .loading,
                .empty-state {
                    background-color: #2d3748;
                    color: #e2e8f0;
                }

                .error {
                    background-color: #742a2a;
                    color: #feb2b2;
                }
            }

            @media (max-width: 768px) {
                .notes-grid {
                    grid-template-columns: 1fr;
                }
            }
        `
    ]
})
export class NoteComponent implements OnInit {
    notes: Note[] = [];
    organizedNotes: NotesByCategory[] = [];
    loading = true;
    error: string | null = null;
    courses: CourseType[] = [];

    constructor(
        private noteService: NoteService,
        private courseService: CourseService
    ) {}

    ngOnInit(): void {
        this.fetchData();
    }

    fetchData(): void {
        this.loading = true;
        this.error = null;

        // First fetch all courses to get course and lesson names
        this.courseService
            .fetchCoursesFromApi()
            .pipe(
                catchError((err) => {
                    console.error('Error fetching courses:', err);
                    this.error = 'Failed to load courses. Please try again later.';
                    this.loading = false;
                    return of([]);
                })
            )
            .subscribe((courses) => {
                this.courses = courses;

                // Then fetch all notes
                this.noteService
                    .getAllNotes()
                    .pipe(
                        catchError((err) => {
                            console.error('Error fetching notes:', err);
                            this.error = 'Failed to load notes. Please try again later.';
                            this.loading = false;
                            return of([]);
                        })
                    )
                    .subscribe((apiNotes) => {
                        this.notes = apiNotes.map((note) => this.noteService.convertToAppNote(note));
                        this.organizeNotesByCourseAndLesson();
                        this.loading = false;
                    });
            });
    }

    organizeNotesByCourseAndLesson(): void {
        // Create a map to organize notes
        const notesMap = new Map<number, NotesByCategory>();

        // Process each note
        this.notes.forEach((note) => {
            // Find or create course entry
            if (!notesMap.has(note.courseId)) {
                const course = this.courses.find((c) => c.id === note.courseId);
                notesMap.set(note.courseId, {
                    courseName: course ? course.title : `Course ${note.courseId}`,
                    courseId: note.courseId,
                    lessons: []
                });
            }

            const courseEntry = notesMap.get(note.courseId)!;

            // Find or create lesson entry
            let lessonEntry = courseEntry.lessons.find((l) => l.lessonId === note.lessonId);
            if (!lessonEntry) {
                const course = this.courses.find((c) => c.id === note.courseId);
                const lesson = course?.lessons.find((l) => l.id === note.lessonId);

                lessonEntry = {
                    lessonName: lesson ? lesson.title : `Lesson ${note.lessonId}`,
                    lessonId: note.lessonId,
                    notes: []
                };
                courseEntry.lessons.push(lessonEntry);
            }

            // Add note to lesson
            lessonEntry.notes.push(note);
        });

        // Convert map to array
        this.organizedNotes = Array.from(notesMap.values());

        // Sort courses and lessons
        this.organizedNotes.sort((a, b) => a.courseName.localeCompare(b.courseName));
        this.organizedNotes.forEach((course) => {
            course.lessons.sort((a, b) => a.lessonName.localeCompare(b.lessonName));
            course.lessons.forEach((lesson) => {
                lesson.notes.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
            });
        });
    }

    editNote(note: Note): void {
        // Implement edit functionality
        console.log('Edit note:', note);
        // You would typically open a modal or navigate to an edit page
    }

    deleteNote(id: number): void {
        if (confirm('Are you sure you want to delete this note?')) {
            this.noteService.deleteNote(id).subscribe({
                next: () => {
                    this.notes = this.notes.filter((note) => note.id !== id);
                    this.organizeNotesByCourseAndLesson();
                },
                error: (err) => {
                    console.error('Error deleting note:', err);
                    alert('Failed to delete note. Please try again.');
                }
            });
        }
    }
}
