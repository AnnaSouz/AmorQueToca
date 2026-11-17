import { Routes } from '@angular/router';
import { Login } from './paginas/login/login';
import { Cadastro } from './paginas/cadastro/cadastro';
import { Inicio } from './paginas/inicio/inicio';
import { Chamada } from './paginas/chamada/chamada';
import { guardaAutenticacao } from './servicos/guarda-autenticacao';

export const routes: Routes = [
  { path: '', component: Login },
  { path: 'cadastro', component: Cadastro },
  { path: 'inicio', component: Inicio, canActivate: [guardaAutenticacao] },
  { path: 'chamada', component: Chamada, canActivate: [guardaAutenticacao] },
  { path: '**', redirectTo: '' },
];