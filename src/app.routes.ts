import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { Course } from './app/pages/course/course';
import { NoteComponent } from './app/pages/notes/note.component'; // Import the NoteComponent

import CourseDetailsComponent from './app/pages/course/components/courseDetails';
import { CoursesWidget } from './app/pages/course/components/courseswidget';

import { Crud } from './app/pages/crud/crud';
import { Subscription } from 'rxjs';
import { SubscriptionComponent } from './app/pages/public/components/subscription/subscription.component';
import { Component } from '@angular/core';
import { FormationsWidget } from './app/pages/landing/components/formationswidget';
import { PredictionComponent } from './app/pages/prediction.component';

export const appRoutes: Routes = [
    {
        path: '',
        component: Landing
    },
    {
        path: 'admin',
        component: AppLayout,
        children: [
            {
                path: '',
                loadChildren: () => import('./app/admin/admin.routes').then((m) => m.default)
            }
        ]
    },
    { path: 'formations', component: FormationsWidget },
    {
        path: 'dashboard',
        component: Dashboard
    },
    { path: 'subscription', component: SubscriptionComponent },
    {
        path: '',
        component: AppLayout,
        children: [
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
            },
            { path: 'notes', component: NoteComponent },
            {
                path: 'internships',
                loadComponent: () => import('./app/pages/pfe/internships/internships.component').then((m) => m.InternshipsComponent)
            },
            {
                path: 'proposals',
                loadComponent: () => import('./app/pages/pfe/proposals/proposals.component').then((m) => m.ProposalsComponent)
            },
            {
                path: 'manage-proposals',
                loadComponent: () => import('./app/pages/pfe/manage-proposals/manage-proposals.component').then((m) => m.ManageProposalsComponent)
            },
            {
                path: 'technical-tests',
                loadComponent: () => import('./app/pages/technical-tests/technical-tests.component').then((m) => m.TechnicalTestsComponent)
            },
            {
                path: 'technical-tests/:id',
                loadComponent: () => import('./app/pages/technical-tests/technical-test-detail/technical-test-detail.component').then((m) => m.TechnicalTestDetailComponent)
            },
            {
                path: 'saved-pfes',
                loadComponent: () => import('./app/pages/pfe/saved/saved-pfes.component').then((m) => m.SavedPfesComponent)
            }
        ]
    },
    {path: 'prediction', component: PredictionComponent},
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
