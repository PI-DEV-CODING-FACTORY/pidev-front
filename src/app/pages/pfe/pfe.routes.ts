import { Routes } from '@angular/router';

export const PFE_ROUTES: Routes = [
    { 
        path: '', 
        redirectTo: 'add',
        pathMatch: 'full'
    },
    { 
        path: 'add', 
        loadComponent: () => import('./add/add-pfe.component').then(m => m.AddPfeComponent)
    },
    { 
        path: 'internships', 
        loadComponent: () => import('./internships/internships.component').then(m => m.InternshipsComponent)
    },
    { 
        path: 'proposals', 
        loadComponent: () => import('./proposals/proposals.component').then(m => m.ProposalsComponent)
    }
]; 