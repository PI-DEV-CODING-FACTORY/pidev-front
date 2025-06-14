import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { CourseType, StudentProgress } from '../../../models/course.model';
import { ApiResponse, Recommendation } from '../../../services/course.service';
import { CourseService } from '../../../services/course.service';
import { StudentProgressService } from '../../../services/student-progress.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { RouterModule } from '@angular/router';
import { Dialog, DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { SkeletonModule } from 'primeng/skeleton';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

interface CourseWithProgress extends CourseType {
    progressPercentage?: number;
}

@Component({
    selector: 'courses-widget',
    standalone: true,
    imports: [CommonModule, RouterModule, ButtonModule, CardModule, TagModule, Dialog, ButtonModule, InputTextModule, ReactiveFormsModule, DropdownModule, SkeletonModule, ProgressSpinnerModule],
    template: `
        <div class="widget-container">
            <div class="header-section">
                <div class="title">Your courses</div>
                <span class="subtitle">Choose a course and start your learning journey!</span>
                <button (click)="createCourseModal()">Generate your costumized course</button> <p-button (click)="showDialog()" label="Let AI Create Your Course!" />
                <p-dialog header="Create AI Course" [modal]="true" [(visible)]="visible" [style]="{ width: '30rem' }">
                    <span class="p-text-secondary block mb-8">Tell us what you want to learn.</span>
                    <form [formGroup]="courseForm" (ngSubmit)="onSubmit()">                        <div class="form-field mb-4">
                            <label for="subject" class="form-label">Subject you want to learn</label>
                            <input pInputText id="subject" formControlName="subject" class="form-input" autocomplete="off" />
                        </div>
                        <div class="form-field mb-8">
                            <label for="level" class="form-label">Your level</label>
                            <p-dropdown id="level" formControlName="level" [options]="levelOptions" optionLabel="label" optionValue="value" placeholder="Select level" [style]="{ width: '100%' }" appendTo="body"> </p-dropdown>
                        </div>
                        <div class="spinner-container" *ngIf="isFormSubmitting">
                            <div class="spinner-content">
                                <p-progressSpinner [style]="{ width: '60px', height: '60px' }" styleClass="custom-spinner" strokeWidth="4" fill="var(--surface-ground)" animationDuration=".5s"></p-progressSpinner>
                                <div class="mt-3">Generating your course...</div>
                            </div>
                        </div>
                        <div class="flex justify-end gap-2" *ngIf="!isFormSubmitting">
                            <p-button label="Cancel" severity="secondary" type="button" (click)="visible = false" />
                            <p-button type="submit" label="Save" />
                        </div>
                    </form>
                </p-dialog>
            </div>
            <!-- Recommended Courses Section -->
            <div class="recommended-section">
                <div class="section-title">Recommended for you</div>
                <div class="courses-grid">
                    <ng-container *ngIf="isRecommendedLoading; else recommendedContent">
                        <!-- Skeleton loaders for recommended courses -->
                        <div *ngFor="let i of [1, 2, 3]" class="course-item">
                            <div class="skeleton-card">
                                <p-skeleton height="2rem" width="70%" styleClass="mb-2"></p-skeleton>
                                <p-skeleton height="10rem" styleClass="mb-2"></p-skeleton>
                                <div class="skeleton-footer">
                                    <p-skeleton height="2rem" width="40%"></p-skeleton>
                                    <p-skeleton height="2rem" width="30%"></p-skeleton>
                                </div>
                            </div>
                        </div>
                    </ng-container>
                    <ng-template #recommendedContent>
                        <div *ngFor="let course of recommendedCourses" class="course-item">
                            <p-card [header]="course.title" styleClass="course-card recommended-card">
                                <div class="card-content">
                                    <p class="course-description">{{ course.description }}</p>

                                    <div class="tag-container">
                                        <p-tag [value]="course.difficultyLevel" [severity]="getDifficultySeverity(course.difficultyLevel)"></p-tag>
                                    </div>
                                    <div class="card-footer">
                                        <span class="lessons-count">{{ course.lessons.length || 0 }} lessons</span>
                                        <p-button label="Explore" icon="pi pi-arrow-right" [routerLink]="['/courses', course.id]" styleClass="p-button-rounded" [loading]="course.id === loadingCourseId" (click)="startCourse(course.id)"> </p-button>
                                    </div>
                                </div>
                            </p-card>
                        </div>
                    </ng-template>
                </div>
            </div>

            <div class="courses-grid">
                <ng-container *ngIf="isCoursesLoading; else coursesContent">
                    <!-- Skeleton loaders for courses -->
                    <div *ngFor="let i of [1, 2, 3, 4, 5, 6]" class="course-item">
                        <div class="skeleton-card">
                            <p-skeleton height="2rem" width="70%" styleClass="mb-2"></p-skeleton>
                            <p-skeleton height="1rem" width="100%" styleClass="mb-2"></p-skeleton>
                            <p-skeleton height="0.5rem" width="80%" styleClass="mb-3"></p-skeleton>
                            <div class="skeleton-footer">
                                <p-skeleton height="2rem" width="40%"></p-skeleton>
                                <p-skeleton height="2rem" width="30%"></p-skeleton>
                            </div>
                        </div>
                    </div>
                </ng-container>
                <ng-template #coursesContent>
                    <div *ngFor="let course of courses" class="course-item">
                        <p-card [header]="course.title" styleClass="course-card">
                            <div class="card-content">
                                <div class="progress-container">
                                    <div class="progress-bar">
                                        <div class="progress-fill" [style.width.%]="course.progressPercentage || 0"></div>
                                    </div>
                                    <small class="progress-text">Progress: {{ course.progressPercentage || 0 }}%</small>
                                </div>
                                <div class="card-footer">
                                    <span class="lessons-count">{{ course.lessons.length || 0 }} lessons</span>
                                    <p-button label="Start Learning" icon="pi pi-book" [routerLink]="['/courses', course.id]" styleClass="p-button-rounded" [loading]="course.id === loadingCourseId" (click)="startCourse(course.id)"> </p-button>
                                </div>
                            </div>
                        </p-card>
                    </div>
                </ng-template>
            </div>
        </div>
    `,
    styles: [
        `
            .widget-container {
                font-family:
                    'Inter',
                    -apple-system,
                    BlinkMacSystemFont,
                    'Segoe UI',
                    Roboto,
                    Oxygen,
                    Ubuntu,
                    sans-serif;
                padding: 1.5rem;
                max-width: 1200px;
                margin: 0 auto;
            }

            .header-section {
                margin-bottom: 2rem;
                text-align: center;
            }

            .title {
                font-size: 1.75rem;
                font-weight: 700;
                color: #2c3e50;
                margin-bottom: 0.5rem;
            }

            .subtitle {
                font-size: 1rem;
                color: #7f8c8d;
            }

            .courses-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 1.5rem;
            }

            .course-item {
                transition: transform 0.2s ease;
            }

            .course-item:hover {
                transform: translateY(-5px);
            }

            :host ::ng-deep .course-card {
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
                height: 100%;
                display: flex;
                flex-direction: column;
            }

            :host ::ng-deep .course-card .p-card-body {
                flex: 1;
                display: flex;
                flex-direction: column;
            }

            :host ::ng-deep .course-card .p-card-content {
                flex: 1;
                padding-bottom: 1rem;
            }

            .image-container {
                height: 160px;
                overflow: hidden;
                background: #f1f5f9;
            }

            .course-image {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .card-content {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }

            .progress-container {
                margin-top: 0.5rem;
            }

            .progress-bar {
                height: 8px;
                background-color: #e9ecef;
                border-radius: 4px;
                overflow: hidden;
                margin-bottom: 0.25rem;
            }

            .progress-fill {
                height: 100%;
                background-color: #4caf50;
                border-radius: 4px;
            }

            .progress-text {
                color: #6c757d;
                font-size: 0.8rem;
            }

            .difficulty-tag {
                margin-top: 0.5rem;
            }

            .card-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: auto;
                padding-top: 1rem;
            }

            .lessons-count {
                font-size: 0.9rem;
                color: #6c757d;
            }

            @media (max-width: 768px) {
                .courses-grid {
                    grid-template-columns: 1fr;
                }
            }

            :host ::ng-deep .p-dropdown {
                width: 100%;
                min-height: 40px;
            }

            :host ::ng-deep .p-dropdown-panel {
                z-index: 1100 !important; /* Ensure dropdown appears above other elements */
            }

            :host ::ng-deep .p-dropdown-items-wrapper {
                max-height: 200px; /* Control the height of the dropdown list */
            }
            :host ::ng-deep .p-dropdown-item {
                padding: 0.75rem 1rem;
                font-size: 14px;
            }            :host ::ng-deep .p-dialog {
                z-index: 1000;
            }
            
            :host ::ng-deep .custom-spinner .p-progress-spinner-circle {
                stroke: #4caf50 !important;
                animation-duration: 1s;
            }
            
            /* Spinner container styles */
            .spinner-container {
                display: flex;
                justify-content: center;
                align-items: center;
                margin: 1.5rem 0;
                min-height: 100px;
            }
            
            .spinner-content {
                display: flex;
                flex-direction: column;
                align-items: center;
                text-align: center;
            }
            
            /* Ensure the dropdown opens properly in the dialog */
            :host ::ng-deep .p-dialog-content {
                overflow: visible !important;
            }

            /* Add these form styles */
            .form-field {
                margin-bottom: 1.5rem;
            }

            .form-label {
                display: block;
                font-weight: 600;
                margin-bottom: 0.5rem;
                font-size: 0.9rem;
                color: #4a5568;
            }

            .form-input {
                width: 100%;
                padding: 0.75rem;
                border-radius: 4px;
                border: 1px solid #e2e8f0;
            }

            @media (prefers-color-scheme: dark) {
                .form-label {
                    color: #e2e8f0;
                }

                .form-input {
                    background-color: #2d3748;
                    border-color: #4a5568;
                    color: #e2e8f0;
                }
            } /* Add styles for recommended courses section */
            .recommended-section {
                margin-bottom: 3rem;
            }

            .section-title {
                font-size: 1.5rem;
                font-weight: 600;
                color: #2c3e50;
                margin-bottom: 1.25rem;
                padding-bottom: 0.5rem;
                border-bottom: 2px solid #e9ecef;
            }

            :host ::ng-deep .recommended-card {
                border-left: 4px solid #4caf50;
            }

            .course-description {
                margin: 0.5rem 0 1rem;
                color: #6c757d;
                font-size: 0.9rem;
                line-height: 1.4;
            }

            .tag-container {
                margin-bottom: 1rem;
            }

            /* Skeleton card styles */
            .skeleton-card {
                background-color: #ffffff;
                border-radius: 12px;
                padding: 1.25rem;
                box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
                height: 100%;
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }

            .skeleton-footer {
                display: flex;
                justify-content: space-between;
                margin-top: auto;
            }

            /* Responsive adjustments */
            @media (max-width: 768px) {
                .section-title {
                    text-align: center;
                }
            }
        `
    ]
})
export class CoursesWidget implements OnInit {
    courseService: CourseService = inject(CourseService);
    studentProgressService: StudentProgressService = inject(StudentProgressService);
    private fb = inject(FormBuilder);
    courses!: CourseWithProgress[];
    visible: boolean = false;
    courseForm: FormGroup;

    // Loading states
    isCoursesLoading: boolean = true;
    isRecommendedLoading: boolean = true;
    loadingCourseId: number | null = null;
    isFormSubmitting: boolean = false;

    // Add recommended courses static data
    recommendedCourses: CourseWithProgress[] = [];

    // Level options remain the same
    levelOptions = [
        { label: 'Beginner', value: 'BEGINNER' },
        { label: 'Medium', value: 'INTERMEDIATE' },
        { label: 'Advanced', value: 'ADVANCED' }
    ];

    constructor() {
        this.courseForm = this.fb.group({
            subject: [''],
            level: [''],
            theme: ['#4caf50'] // Default theme color
        });
    }

    ngOnInit(): void {
        this.loadCoursesAndProgress();
        this.loadRecommendedCourses();
    }
    loadCoursesAndProgress(): void {
        this.isCoursesLoading = true;
        this.courseService.fetchCoursesFromApi().subscribe({
            next: (data) => {
                this.courses = data;

                // Fetch and log all student progress
                this.studentProgressService.getAllProgress().subscribe({
                    next: (progress) => {
                        console.log('All student progress:', progress);

                        // Calculate progress for each course
                        this.calculateCourseProgress(progress);
                        this.isCoursesLoading = false;
                    },
                    error: (error) => {
                        console.error('Error fetching student progress:', error);
                        this.isCoursesLoading = false;
                    }
                });
            },
            error: (error) => {
                console.error('Error fetching courses:', error);
                this.isCoursesLoading = false;
            }
        });
    }

    loadRecommendedCourses(): void {
        this.isRecommendedLoading = true;
        const top_n = 3;
        this.courseService.recommandCourse(top_n).subscribe({
            next: (response: ApiResponse) => {
                this.recommendedCourses = response.recommendations.map((item: Recommendation) => ({
                    id: Math.floor(Math.random() * 1000), // Generate a unique ID
                    title: item.formation,
                    description:
                        `Compétences: ${item.competences.join(', ')}. ` +
                        `Centre d'intérêt: ${item.centre_interet || 'BEGINNER'}. ` +
                        `Durée: ${item.duree || 0} mois. ` +
                        `Note: ${item.note || 0}/5. ` +
                        `Score de similarité: ${item.similarity_score.toFixed(2)}.`,
                    difficultyLevel: 'BEGINNER', // Default to BEGINNER as a safe choice
                    lessons: [],
                    generatedByAi: true,
                    examples: '',
                    content: '',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    quizzes: [],
                    studentProgresses: [],
                    exampleHistories: [],
                    progressPercentage: 0
                }));
                this.isRecommendedLoading = false;
            },
            error: (err) => {
                console.error('Error fetching recommended courses:', err);
                this.recommendedCourses = [];
                this.isRecommendedLoading = false;
            }
        });
    }

    calculateCourseProgress(allProgress: StudentProgress[]): void {
        // For each course, find its progress entries and calculate percentage
        this.courses.forEach((course) => {
            // Find all progress entries for this course
            const courseProgress = allProgress.filter((p) => p.courseId === course.id);

            if (courseProgress && courseProgress.length > 0) {
                // Calculate average score or completion percentage
                const totalScore = courseProgress.reduce((sum, p) => {
                    // Convert score to number if it's a string or use 0 if null/undefined
                    return sum + (p.score ? Number(p.score) : 0);
                }, 0);

                // Calculate percentage based on your scoring system
                // This is a simple average calculation, adjust as needed
                const progressPercentage = courseProgress.length > 0 ? Math.round(totalScore / courseProgress.length) : 0;

                // Assign the calculated progress to the course
                course.progressPercentage = progressPercentage;
            } else {
                // No progress records found for this course
                course.progressPercentage = 0;
            }
        });
    }

    createCourseModal() {
        console.log('Create course modal');
    }
    getDifficultySeverity(difficulty: string): string {
        switch (difficulty) {
            case 'BEGINNER':
                return 'success';
            case 'INTERMEDIATE':
                return 'warning';
            case 'ADVANCED':
                return 'danger';
            default:
                return 'info';
        }
    }

    startCourse(courseId: number): void {
        // Set the loading state for this specific course
        this.loadingCourseId = courseId;

        // Simulate API request delay
        setTimeout(() => {
            this.loadingCourseId = null;
        }, 1000); // Reset after navigation
    }

    showDialog() {
        this.visible = true;
    }
    onSubmit() {
        if (this.courseForm.valid) {
            this.isFormSubmitting = true;

            const newCourse: Partial<CourseType> = {
                title: 'not generated',
                description: this.courseForm.value.subject,
                generatedByAi: true,
                difficultyLevel: this.courseForm.value.level || 'BEGINNER',
                examples: '',
                content: '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                lessons: [],
                quizzes: [],
                studentProgresses: [],
                exampleHistories: []
            };

            this.courseService.createCourse(newCourse).subscribe({
                next: (response) => {
                    console.log('Course created:', response);
                    this.isFormSubmitting = false;
                    this.visible = false;
                    this.courseForm.reset();
                    // Refresh the courses list and log progress
                    this.loadCoursesAndProgress();
                },
                error: (error) => {
                    console.error('Error creating course:', error);
                    this.isFormSubmitting = false;
                }
            });
        }
    }
}
