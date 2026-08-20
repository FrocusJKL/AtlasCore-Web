import { Routes } from '@angular/router';

import { Login } from './features/auth/pages/login/login';
import { Dashboard } from './features/dashboard/dashboard';
import { MainLayout } from './layout/main-layout/main-layout';

import { Users } from './features/users/users';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  {
    path: 'login',
    component: Login,
  },

  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: Dashboard,
      },
      {
        path: 'users',
        component: Users,
      },
    ],
  },

  {
    path: '**',
    redirectTo: 'login',
  },
];