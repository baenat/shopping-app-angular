import { Routes } from '@angular/router';
import { isAdminGuard } from '@auth/guards/is-admin.guard';
import { notAuthenticatedGuard } from '@auth/guards/not-authenticated.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then(r => r.authRoutes),
    canMatch: [notAuthenticatedGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then(r => r.adminRoutes),
    canMatch: [isAdminGuard]
  },
  {
    path: '',
    loadChildren: () => import('./store-front/store-front.routes').then(r => r.storeFrontRoutes),
  },
];
