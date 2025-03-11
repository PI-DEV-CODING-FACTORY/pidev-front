import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { Course } from './course/course';
import CourseDetailsComponent from './course/components/courseDetails';
import { CoursesWidget } from './course/components/courseswidget';
import { Routes } from '@angular/router';


export default [
    { path: 'documentation', component: Documentation },
    { path: 'crud', component: Crud },
    { path: 'empty', component: Empty },
    {
        path: 'courses',
        component: Course,
        children: [
            { path: '', component: CoursesWidget },
            { path: ':id', component: CourseDetailsComponent },
     
        ]
    },

    {
        path: 'pfe',
        loadChildren: () => import('./pfe/pfe.routes').then((m) => m.PFE_ROUTES)
    },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
