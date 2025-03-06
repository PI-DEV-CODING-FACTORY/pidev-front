import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseService } from '../../../services/course.service';
import { CourseType } from '../../../models/course.model';
import { AccordionModule } from 'primeng/accordion';
import { CardModule } from 'primeng/card';
import { ActivatedRoute } from '@angular/router';
import { NgbdScrollSpyItems } from './ngbdscrollspyItems';
import { NgbdAccordionToggle } from './ngbdAccordiontoggle';

@Component({
    selector: 'app-course-details',
    standalone: true,
    imports: [CommonModule, AccordionModule, CardModule, NgbdScrollSpyItems, NgbdAccordionToggle],
    template: `
        <div class="card">
            <div class="course-details p-4">
                <h2 class="text-2xl font-bold mb-4">{{ course?.title }}</h2>
                <p class="text-gray-600 mb-6">{{ course?.description }}</p>

                <ngbd-scrollspy-items [course]="course"></ngbd-scrollspy-items>
            </div>
        </div>
    `,
    styles: [``]
})
export default class CourseDetailsComponent implements OnInit {
    course?: CourseType;

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
        this.courseService.getCourseById(id).subscribe({
            next: (course) => {
                this.course = course;
            },
            error: (error) => {
                console.error('Error loading course:', error);
            }
        });
    }
}
