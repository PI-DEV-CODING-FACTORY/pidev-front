import { Component } from '@angular/core';
import { CoursesWidget } from './components/courseswidget';
import CourseDetailsComponent from './components/courseDetails';
import { RouterModule } from '@angular/router';
import { NgbdScrollSpyItems, DialogContentExampleDialog } from './components/ngbdscrollspyItems';
import { NgbdAccordionToggle } from './components/ngbdAccordiontoggle';
import { NgbdModalBasic } from './components/sd';

@Component({
    selector: 'app-course',
    standalone: true,
    imports: [CoursesWidget, CourseDetailsComponent, RouterModule, NgbdScrollSpyItems, NgbdAccordionToggle, DialogContentExampleDialog],
    template: `
        <dialog-content-example-dialog></dialog-content-example-dialog>
        <div class="card">
            <router-outlet></router-outlet>
        </div>
    `
})
export class Course {}
