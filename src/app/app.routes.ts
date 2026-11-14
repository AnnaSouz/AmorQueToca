import { Routes } from '@angular/router';
import { Login } from './paginas/login/login';
import { Inicio } from './paginas/inicio/inicio';
import { guardaAutenticacao } from './servicos/guarda-autenticacao';

export const routes: Routes = [
  { path: '', component: Login },
  { path: 'inicio', component: Inicio, canActivate: [guardaAutenticacao] },
  { path: '**', redirectTo: '' },
];