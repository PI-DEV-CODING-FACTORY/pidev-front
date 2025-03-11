import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { CourseType } from '../../../models/course.model';
import { CourseService } from '../../../services/course.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { RouterModule } from '@angular/router';
import { Dialog, DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
@Component({
    selector: 'courses-widget',
    standalone: true,
    imports: [CommonModule, RouterModule, ButtonModule, CardModule, TagModule, Dialog, ButtonModule, InputTextModule, ReactiveFormsModule],
    template: `
        <div class="widget-container">
            <div class="header-section">
                <div class="title">Your courses</div>
                <span class="subtitle">Choose a course and start your learning journey!</span>
                <button (click)="createCourseModal()">Generate your costumized course</button>

                <p-button (click)="showDialog()" label="Show" />
                <p-dialog header="Edit Profile" [modal]="true" [(visible)]="visible" [style]="{ width: '25rem' }">
                    <span class="p-text-secondary block mb-8">Update your information.</span>
                    <form [formGroup]="courseForm" (ngSubmit)="onSubmit()">
                        <div class="flex items-center gap-4 mb-4">
                            <label for="subject" class="font-semibold w-24">Subject you want to learn</label>
                            <input pInputText id="subject" formControlName="subject" class="flex-auto" autocomplete="off" />
                        </div>
                        <div class="flex items-center gap-4 mb-8">
                            <label for="level" class="font-semibold w-24">your level </label>
                            <input pInputText id="level" formControlName="level" class="flex-auto" autocomplete="off" />
                        </div>
                        <div class="flex justify-end gap-2">
                            <p-button label="Cancel" severity="secondary" type="button" (click)="visible = false" />
                            <p-button type="submit" label="Save" />
                        </div>
                    </form>
                </p-dialog>
            </div>
            <div class="courses-grid">
                <div *ngFor="let course of courses" class="course-item">
                    <p-card [header]="course.title" styleClass="course-card">
                        <ng-template pTemplate="header">
                            <div class="image-container">
                                <img *ngIf="" [src]="" class="course-image" />
                            </div>
                        </ng-template>
                        <div class="card-content">
                            <div *ngIf="course.studentProgresses !== undefined" class="progress-container">
                                <div class="progress-bar">
                                    <div class="progress-fill" [style.width.%]="30"></div>
                                </div>
                                <small class="progress-text">Progress: {{ 30 }}%</small>
                            </div>

                            <div class="card-footer">
                                <span class="lessons-count">{{ course.lessons.length || 0 }} lessons</span>
                                <p-button label="Start Learning" icon="pi pi-book" [routerLink]="['/courses', course.id]" styleClass="p-button-rounded"></p-button>
                            </div>
                        </div>
                    </p-card>
                </div>
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
        `
    ]
})
export class CoursesWidget {
    courseService: CourseService = inject(CourseService);
    private fb = inject(FormBuilder);
    courses!: CourseType[];
    visible: boolean = false;
    courseForm: FormGroup;

    constructor() {
        this.courseService.fetchCoursesFromApi().subscribe({
            next: (data) => {
                this.courses = data;
            },
            error: (error) => {
                console.error('Error fetching courses:', error);
            }
        });
        this.courseForm = this.fb.group({
            subject: [''],
            level: ['']
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

    showDialog() {
        this.visible = true;
    }

    onSubmit() {
        if (this.courseForm.valid) {
            const newCourse: Partial<CourseType> = {
                title: 'not generated',
                description: this.courseForm.value.subject,
                generatedByAi: true,
                difficultyLevel: 'BEGINNER',
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
                    this.visible = false;
                    this.courseForm.reset();
                    // Refresh the courses list
                    this.courseService.fetchCoursesFromApi().subscribe({
                        next: (data) => {
                            this.courses = data;
                        }
                    });
                },
                error: (error) => {
                    console.error('Error creating course:', error);
                }
            });
        }
    }
}
