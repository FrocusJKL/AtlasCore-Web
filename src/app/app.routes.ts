import { Routes } from '@angular/router';

import { Login } from './features/auth/pages/login/login';
import { Dashboard } from './features/dashboard/dashboard';
import { MainLayout } from './layout/main-layout/main-layout';

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
        path: 'dashboard',
        component: Dashboard,
      },

    ],
  },

  {
    path: '**',
    redirectTo: 'login',
  }

];