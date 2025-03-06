import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { ParticipantsPageComponent } from './app/pages/event/participants-page/participants-page.component';
import { EditEventComponent } from './app/pages/event/edit-event/edit-event.component';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            { path: '', component: Dashboard },
            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'documentation', component: Documentation },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') },
            { path: 'event', loadChildren: () => import('./app/pages/event/event.routes').then(m => m.EVENT_ROUTES) },
            { path: 'participants/:eventId', component: ParticipantsPageComponent },
            { path: 'pfe', loadChildren: () => import('./app/pages/pfe/pfe.routes').then(m => m.PFE_ROUTES) },
            { path: 'edit-event/:id', component: EditEventComponent }
        ]
    },
    { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
