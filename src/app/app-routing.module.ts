import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // Dashboard and other routes...
  // {
  //   path: 'dashboard',
  //   loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  // },
  // Events routes
  {
    path: 'events/:eventId/teams',
    loadComponent: () => import('./pages/event/team-management/team-management.component').then(m => m.TeamManagementComponent)
  },
  // Participants route
  {
    path: 'participants/:eventId',
    loadComponent: () => import('./pages/event/participants-page/participants-page.component').then(m => m.ParticipantsPageComponent)
  },
  // Redirect to dashboard if no route matches
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    enableTracing: true // <-- Enable route tracing for debugging
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { } 