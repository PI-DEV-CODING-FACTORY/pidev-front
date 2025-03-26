import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { Crud } from './app/pages/crud/crud';
import { Subscription } from 'rxjs';
import { SubscriptionComponent } from './app/pages/public/subscription';

export const appRoutes: Routes = [
    {
        path: '',
        component: Landing,
    },
    { path: 'dashboard', component: Dashboard },
    // { path: 'crud', component: Crud},
    { path: 'subscription', component: SubscriptionComponent},
    { path: 'notfound', component: Notfound },
    // { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
