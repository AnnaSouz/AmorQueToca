import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { from, of, switchMap } from 'rxjs';
import { Autenticacao } from './autenticacao';

export const guardaAutenticacao: CanActivateFn = () => {
  const roteador = inject(Router);
  const autenticacao = inject(Autenticacao);
  const telaLogin = roteador.createUrlTree(['/']);

  return autenticacao.usuarioAtual().pipe(
    switchMap((usuario) => {
      if (!usuario?.email) {
        return of(telaLogin);
      }
      return from(
        autenticacao
          .emailAutorizado(usuario.email)
          .then(async (autorizado) => {
            if (autorizado) {
              return true;
            }
            await autenticacao.sair();
            return telaLogin;
          })
          // Sem internet e sem cache, a consulta falha: deixa abrir o app,
          // porque as regras do Firestore continuam bloqueando quem não está na lista.
          .catch(() => true),
      );
    }),
  );
};
