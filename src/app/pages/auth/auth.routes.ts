import { Routes } from '@angular/router';
import { Access } from './access';
import { Login } from './login';
import { Error } from './error';

import { Register } from './register';
import { ResetPassword } from './reset-password';

export default [
    { path: 'access', component: Access },
    { path: 'error', component: Error },
    { path: 'login', component: Login },

    { path: 'register', component: Register },

    { path: 'reset-password', component: ResetPassword }
] as Routes;
