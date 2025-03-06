import { Routes } from '@angular/router';

export const EVENT_ROUTES: Routes = [
    { 
        path: '', 
        redirectTo: 'view',
        pathMatch: 'full'
    },
    { 
        path: 'add', 
        loadComponent: () => import('./add/event.component').then(m => m.EventFormComponent)
    },
    { 
        path: 'view', 
        loadComponent: () => import('./Vie/view.component').then(m => m.ViewComponent)
    },
    { 
        path: 'viewUser', 
        loadComponent: () => import('./User/viewUser.component').then(m => m.AffichageComponent)
    },
 
];
