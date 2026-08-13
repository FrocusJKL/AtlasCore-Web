import { Routes } from '@angular/router';
import { Login } from './features/auth/pages/login/login';
import { MainLayout } from './layout/main-layout/main-layout';

export const routes: Routes = [
  {
    path: '',
    component: Login,
  },
  {
    path: '',
    component: MainLayout,
    children: [],
  },
];
