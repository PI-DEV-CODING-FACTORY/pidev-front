import { Component, inject } from '@angular/core';
import { CoursesWidget } from './components/courseswidget';
import CourseDetailsComponent from './components/courseDetails';
import { RouterModule } from '@angular/router';
import { NgbdScrollSpyItems } from './components/ngbdscrollspyItems';
import { NgbdAccordionToggle } from './components/ngbdAccordiontoggle';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { ExampleService } from '../../services/example.service';
import { ExampleType } from '../../models/example.model';

@Component({
    selector: 'app-course',
    standalone: true,
    imports: [CoursesWidget, CourseDetailsComponent, RouterModule, NgbdScrollSpyItems, NgbdAccordionToggle, FormsModule, CommonModule],
    template: `
        <div class="card">
            <router-outlet></router-outlet>
        </div>
    `,
    styles: [
        `
            .forum-button {
                background: #3f51b5;
                color: white;
                padding: 0.75rem 1.5rem;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                margin-bottom: 1rem;
            }
            .create-course-btn {
                background: #3f51b5;
                color: white;
                padding: 0.75rem 1.5rem;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                margin-bottom: 1rem;
            }
        `
    ]
})
export class Course {
    showPopup = false;
    newCourse = {
        title: '',
        description: ''
    };
    exampleService: ExampleService = inject(ExampleService);
    exampleList: ExampleType[] = [];
    constructor(
        private renderer: Renderer2,
        private router: Router
    ) {
        this.exampleService.fetchExamplesFromApi().subscribe(
            (examples) => {
                this.exampleList = examples;
                console.log('Examples:', examples);
            },
            (error) => {
                console.error('Error fetching examples:', error);
            }
        );
        this.exampleService.getExamplesByCourseId(1).subscribe(
            (examples) => {
                this.exampleList = examples;
                console.log('this one :', examples);
            },
            (error) => {
                console.error('Error fetching examples:', error);
            }
        );
    }

    togglePopup(show: boolean) {
        this.showPopup = show;
        if (show) {
            this.renderer.addClass(document.body, 'overflow-hidden');
        } else {
            this.renderer.removeClass(document.body, 'overflow-hidden');
        }
    }

    saveCourse() {
        console.log('New Course:', this.newCourse);
        this.togglePopup(false);
        this.newCourse = { title: '', description: '' };
    }

    navigateToCreateCourse() {
        this.router.navigate(['/courses/create']);
    }
}
