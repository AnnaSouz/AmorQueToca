import { inject } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';

export const guardaAutenticacao: CanActivateFn = () => {
  const roteador = inject(Router);
  return authState(inject(Auth)).pipe(
    map((usuario) => (usuario ? true : roteador.createUrlTree(['/']))),
  );
};