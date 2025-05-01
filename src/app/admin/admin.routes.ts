import { Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
            },
            {
                path: 'users',
                loadComponent: () => import('./components/users-list/users-list.component').then(m => m.UsersListComponent)
            },
            {
                path: 'inscriptions',
                loadComponent: () => import('./components/inscriptions/inscriptions.component').then(m => m.InscriptionsComponent)
            }
        ]
    }
];

export default routes;