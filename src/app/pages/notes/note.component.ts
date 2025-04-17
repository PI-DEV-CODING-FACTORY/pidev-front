import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoteService } from '../../services/note.service';
import { CourseService } from '../../services/course.service';
import { Note } from '../course/components/note-panel.component';
import { HttpClientModule, HttpHeaders, HttpClient } from '@angular/common/http';
import { CourseType } from '../../models/course.model';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { ResumeService } from '../../services/resume.service'; // Import the ResumeService

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
    imports: [CommonModule, HttpClientModule, FormsModule],
    template: `
        <div class="notes-container">
            <h2>My Notes</h2>

            <div *ngIf="loading" class="loading">Loading notes...</div>

            <div *ngIf="error" class="error">
                {{ error }}
            </div>

            <div *ngIf="!loading && !error && organizedNotes.length === 0" class="empty-state">No notes found. Create your first note!</div>

            <div *ngFor="let courseNotes of organizedNotes" class="course-container">
                <div class="course-header">
                    <h3 class="course-title">{{ courseNotes.courseName }}</h3>
                    <button class="resume-btn" (click)="onResumeClick(courseNotes.courseId)">Resume</button>
                </div>

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

        <!-- Edit Note Modal -->
        <div *ngIf="isEditModalOpen" class="modal-overlay">
            <div class="modal-container">
                <div class="modal-header">
                    <h3>Edit Note</h3>
                    <button (click)="closeEditModal()" class="close-button">&times;</button>
                </div>
                <div class="modal-body">
                    <textarea [(ngModel)]="editingNote.content" class="note-textarea" placeholder="Your note..."></textarea>

                    <div class="color-picker">
                        <label>Note Color:</label>
                        <div class="color-options">
                            <div *ngFor="let color of availableColors" [style.background-color]="color" [class.selected]="editingNote.color === color" (click)="editingNote.color = color" class="color-option"></div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button (click)="closeEditModal()" class="modal-button cancel">Cancel</button>
                    <button (click)="saveNote()" [disabled]="!editingNote.content" class="modal-button save">Save Changes</button>
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

            .course-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
            }

            .resume-btn {
                background-color: #4299e1;
                color: white;
                border: none;
                border-radius: 4px;
                padding: 6px 14px;
                font-size: 14px;
                cursor: pointer;
                transition: background-color 0.2s;
                font-weight: 500;
            }

            .resume-btn:hover {
                background-color: #3182ce;
            }

            @media (prefers-color-scheme: dark) {
                .resume-btn {
                    background-color: #3182ce;
                }

                .resume-btn:hover {
                    background-color: #2c5282;
                }
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

            /* Modal Styles */
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }

            .modal-container {
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                width: 90%;
                max-width: 500px;
                max-height: 90vh;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }

            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px 20px;
                border-bottom: 1px solid #e2e8f0;
            }

            .modal-header h3 {
                margin: 0;
                font-size: 18px;
                color: #2d3748;
            }

            .close-button {
                background: none;
                border: none;
                font-size: 22px;
                cursor: pointer;
                color: #a0aec0;
            }

            .close-button:hover {
                color: #4a5568;
            }

            .modal-body {
                padding: 20px;
                flex-grow: 1;
                overflow-y: auto;
            }

            .note-textarea {
                width: 100%;
                min-height: 150px;
                padding: 12px;
                border: 1px solid #e2e8f0;
                border-radius: 4px;
                font-size: 15px;
                color: #4a5568;
                resize: vertical;
                margin-bottom: 15px;
            }

            .color-picker {
                margin-top: 15px;
            }

            .color-picker label {
                display: block;
                margin-bottom: 8px;
                font-size: 14px;
                color: #4a5568;
            }

            .color-options {
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
            }

            .color-option {
                width: 30px;
                height: 30px;
                border-radius: 50%;
                cursor: pointer;
                border: 2px solid transparent;
                transition:
                    transform 0.2s,
                    border-color 0.2s;
            }

            .color-option:hover {
                transform: scale(1.1);
            }

            .color-option.selected {
                border-color: #2d3748;
                transform: scale(1.1);
            }

            .modal-footer {
                display: flex;
                justify-content: flex-end;
                padding: 15px 20px;
                border-top: 1px solid #e2e8f0;
                gap: 10px;
            }

            .modal-button {
                padding: 8px 16px;
                border-radius: 4px;
                border: none;
                font-size: 14px;
                cursor: pointer;
                transition: background-color 0.2s;
            }

            .modal-button.cancel {
                background-color: #e2e8f0;
                color: #4a5568;
            }

            .modal-button.cancel:hover {
                background-color: #cbd5e0;
            }

            .modal-button.save {
                background-color: #4299e1;
                color: white;
            }

            .modal-button.save:hover:not([disabled]) {
                background-color: #3182ce;
            }

            .modal-button.save[disabled] {
                opacity: 0.6;
                cursor: not-allowed;
            }

            @media (prefers-color-scheme: dark) {
                .modal-container {
                    background-color: #1a202c;
                }

                .modal-header {
                    border-bottom-color: #4a5568;
                }

                .modal-header h3 {
                    color: #e2e8f0;
                }

                .close-button {
                    color: #a0aec0;
                }

                .close-button:hover {
                    color: #e2e8f0;
                }

                .note-textarea {
                    background-color: #2d3748;
                    border-color: #4a5568;
                    color: #e2e8f0;
                }

                .color-picker label {
                    color: #e2e8f0;
                }

                .color-option.selected {
                    border-color: #e2e8f0;
                }

                .modal-footer {
                    border-top-color: #4a5568;
                }

                .modal-button.cancel {
                    background-color: #4a5568;
                    color: #e2e8f0;
                }

                .modal-button.cancel:hover {
                    background-color: #2d3748;
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

    // Edit modal properties
    isEditModalOpen = false;
    editingNote: Note = {
        id: undefined,
        courseId: 0,
        lessonId: 0,
        content: '',
        timestamp: new Date(),
        color: '#4299e1'
    };
    originalNoteId: number | undefined;
    availableColors = [
        '#4299e1', // blue
        '#48bb78', // green
        '#ed8936', // orange
        '#ef4444', // red
        '#8b5cf6', // purple
        '#f59e0b', // amber
        '#10b981', // emerald
        '#8b5cf6' // violet
    ];

    constructor(
        private noteService: NoteService,
        private courseService: CourseService,
        private resumeService: ResumeService, // Inject ResumeService
        private http: HttpClient // Add this line
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
        // Clone the note to avoid direct modification
        this.editingNote = {
            id: note.id,
            courseId: note.courseId,
            lessonId: note.lessonId,
            content: note.content,
            timestamp: new Date(note.timestamp),
            color: note.color
        };
        this.originalNoteId = note.id;
        this.isEditModalOpen = true;
    }

    closeEditModal(): void {
        this.isEditModalOpen = false;
    }

    saveNote(): void {
        if (!this.editingNote.content || !this.originalNoteId) {
            return;
        }

        this.noteService
            .updateNote(this.originalNoteId, {
                content: this.editingNote.content,
                color: this.editingNote.color
            })
            .subscribe({
                next: (updatedApiNote) => {
                    // Convert API note to app note format
                    const updatedNote = this.noteService.convertToAppNote(updatedApiNote);

                    // Update the note in our local array
                    const noteIndex = this.notes.findIndex((n) => n.id === this.originalNoteId);
                    if (noteIndex !== -1) {
                        this.notes[noteIndex] = updatedNote;
                    }

                    // Re-organize notes to reflect changes
                    this.organizeNotesByCourseAndLesson();

                    // Close the modal
                    this.closeEditModal();
                },
                error: (err) => {
                    console.error('Error updating note:', err);
                    alert('Failed to update note. Please try again.');
                }
            });
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

    /**
     * Handle Resume button click
     */
    onResumeClick(courseId: number): void {
        console.log('Resume clicked for course ID:', courseId);
        const courseName = this.organizedNotes.find((course) => course.courseId === courseId)?.courseName;
        console.log('Course name:', courseName);

        // Find all notes for this course
        const courseNotes = this.organizedNotes.find((course) => course.courseId === courseId);

        if (!courseNotes) {
            console.error('No notes found for this course');
            return;
        }

        // Collect all notes from all lessons in this course
        const allNotes: { lessonName: string; notes: Note[] }[] = [];
        courseNotes.lessons.forEach((lesson) => {
            if (lesson.notes.length > 0) {
                allNotes.push({
                    lessonName: lesson.lessonName,
                    notes: lesson.notes
                });
            }
        });

        if (allNotes.length === 0) {
            console.log('No notes available to generate a resume');
            return;
        }

        this.generateResume(courseId, courseName || 'Course', allNotes);
    }

    /**
     * Generate a resume using all notes from a course
     */
    generateResume(courseId: number, courseName: string, allNotes: { lessonName: string; notes: Note[] }[]): void {
        // Format notes for processing
        let formattedNotes = `# Notes for ${courseName}\n\n`;

        allNotes.forEach((lessonNotes) => {
            formattedNotes += `## ${lessonNotes.lessonName}\n\n`;

            lessonNotes.notes.forEach((note) => {
                formattedNotes += `- ${note.content}\n`;
                formattedNotes += `  (${new Date(note.timestamp).toLocaleString()})\n\n`;
            });
        });

        console.log('Formatted notes for AI processing:', formattedNotes);

        // Similar structure to the chat component
        const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
        const GROQ_API_KEY = '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';

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${GROQ_API_KEY}`
        });

        const requestBody = {
            model: 'llama-3.3-70b-versatile',
            messages: [
                {
                    role: 'system',
                    content: `You are an AI that creates concise, well-organized summaries. 
                              Generate a comprehensive course resume based on the following notes.
                              Use markdown formatting and organize the resume by lessons. Focus on key concepts.`
                },
                {
                    role: 'user',
                    content: formattedNotes
                }
            ]
        };

        // Show a loading message in console
        console.log('Generating resume...');

        // Make the API call
        this.http.post<any>(GROQ_API_URL, requestBody, { headers }).subscribe({
            next: (response) => {
                const resumeContent = response.choices[0].message.content;
                console.log('Generated Resume:');
                console.log(resumeContent);

                // Optionally, you could also save this resume to your database
                // this.saveResumeToDatabase(courseId, resumeContent);
            },
            error: (error) => {
                console.error('Error generating resume:', error);
            }
        });
    }
}
