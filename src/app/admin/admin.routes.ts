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
            }
        ]
    }
];

export default routes;