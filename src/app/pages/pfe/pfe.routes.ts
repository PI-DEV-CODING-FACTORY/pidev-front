import { Routes } from '@angular/router';

export const PFE_ROUTES: Routes = [
    { 
        path: '', 
        loadComponent: () => import('./list/pfe-list.component').then(m => m.PfeListComponent)
    },
    { 
        path: 'add', 
        loadComponent: () => import('./add/add-pfe.component').then(m => m.AddPfeComponent)
    },
    { 
        path: ':id', 
        loadComponent: () => import('./details/pfe-details.component').then(m => m.PfeDetailsComponent)
    },
    { 
        path: 'edit/:id', 
        loadComponent: () => import('./add/add-pfe.component').then(m => m.AddPfeComponent)
    },
    
]; 