import { Component } from '@angular/core';
import { CoursesWidget } from './components/courseswidget';
import CourseDetailsComponent from './components/courseDetails';
import { RouterModule } from '@angular/router';
import { NgbdScrollSpyItems } from './components/ngbdscrollspyItems';



@Component({
    selector: 'app-course',
    standalone: true,
    imports: [CoursesWidget, CourseDetailsComponent, RouterModule, NgbdScrollSpyItems],
    template: `
        <div class="card">
           
            <router-outlet></router-outlet>
        </div>
    `
})
export class Course {}
