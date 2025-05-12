import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseService } from '../../../services/course.service';
import { CourseType } from '../../../models/course.model';
import { AccordionModule } from 'primeng/accordion';
import { CardModule } from 'primeng/card';
import { ActivatedRoute } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';

import { NgbdScrollSpyItems } from './ngbdscrollspyItems';

@Component({
    selector: 'app-course-details',
    standalone: true,
    imports: [CommonModule, AccordionModule, CardModule, NgbdScrollSpyItems, SkeletonModule],
    template: `
        <div class="card">
            <ng-container *ngIf="isLoading; else loadedContent">
                <!-- Skeleton loader for course details -->
                <div class="course-details p-4">
                    <div class="mb-4">
                        <p-skeleton height="2.5rem" width="60%" styleClass="mb-2"></p-skeleton>
                    </div>
                    <div class="mb-6">
                        <p-skeleton height="1rem" width="90%" styleClass="mb-2"></p-skeleton>
                        <p-skeleton height="1rem" width="85%" styleClass="mb-2"></p-skeleton>
                        <p-skeleton height="1rem" width="80%"></p-skeleton>
                    </div>

                    <!-- Skeleton for lessons -->
                    <div class="content-wrapper">
                        <div class="main-content">
                            <div class="content-section p-3 rounded-2">
                                <div *ngFor="let i of [1, 2, 3]" class="mb-5">
                                    <p-skeleton height="2rem" width="40%" styleClass="mb-2"></p-skeleton>
                                    <p-skeleton height="10rem" width="100%" styleClass="mb-2"></p-skeleton>
                                    <div class="d-flex justify-content-between">
                                        <p-skeleton height="2rem" width="20%"></p-skeleton>
                                        <p-skeleton height="2rem" width="20%"></p-skeleton>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Skeleton for navigation -->
                        <div style="width: 250px">
                            <p-skeleton height="2rem" width="80%" styleClass="mb-2"></p-skeleton>
                            <div *ngFor="let i of [1, 2, 3, 4]" class="mb-2">
                                <p-skeleton height="1.5rem" width="100%"></p-skeleton>
                            </div>
                        </div>
                    </div>
                </div>
            </ng-container>

            <ng-template #loadedContent>
                <div class="course-details p-4">
                    <h2 class="text-2xl font-bold mb-4">{{ course?.title }}</h2>
                    <p class="text-gray-600 mb-6">{{ course?.description }}</p>

                    <ngbd-scrollspy-items [course]="course"></ngbd-scrollspy-items>
                </div>
            </ng-template>
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
        `
    ]
})
export default class CourseDetailsComponent implements OnInit {
    course?: CourseType;
    isLoading: boolean = true;

    constructor(
        private route: ActivatedRoute,
        private courseService: CourseService
    ) {}

    ngOnInit() {
        this.route.params.subscribe((params) => {
            const courseId = +params['id'];
            this.loadCourse(courseId);
        });
    }

    private loadCourse(id: number) {
        this.isLoading = true;
        this.courseService.getCourseById(id).subscribe({
            next: (course) => {
                this.course = course;
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Error loading course:', error);
                this.isLoading = false;
            }
        });
    }
}
