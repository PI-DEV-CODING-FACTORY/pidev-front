import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { EVENT_ROUTES } from './event/event.routes'; // ✅ Import your event routes

export default [
    { path: 'documentation', component: Documentation },
    { path: 'crud', component: Crud },
    { path: 'empty', component: Empty },
    { 
        path: 'event', 
        children: EVENT_ROUTES // ✅ Correctly integrate EVENT_ROUTES
    },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
