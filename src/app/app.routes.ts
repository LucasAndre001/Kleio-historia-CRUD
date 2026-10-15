import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./public/home/home').then(m => m.Home) },
  {
    path: 'artigo/:id',
    loadComponent: () => import('./public/leitura-artigo/leitura-artigo').then(m => m.LeituraArtigo),
  },
  { path: 'admin/login', loadComponent: () => import('./admin/login/login').then(m => m.Login) },
  {
    path: 'admin/painel',
    loadComponent: () => import('./admin/painel/painel').then(m => m.Painel),
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '' },
];
