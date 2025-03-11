import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { Course } from './app/pages/course/course';

import CourseDetailsComponent from './app/pages/course/components/courseDetails';
import { CoursesWidget } from './app/pages/course/components/courseswidget';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            { path: '', component: Dashboard },
            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'documentation', component: Documentation },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') },
            { path: 'pfe', loadChildren: () => import('./app/pages/pfe/pfe.routes').then((m) => m.PFE_ROUTES) },
            {
                path: 'courses',
                component: Course,
                children: [
                    { path: '', component: CoursesWidget },
                    { path: ':id', component: CourseDetailsComponent }
                ]
            }
        ]
    },

    { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
