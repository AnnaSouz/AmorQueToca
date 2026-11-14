import { Injectable, inject } from '@angular/core';
import {
  Auth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class Autenticacao {
  private auth = inject(Auth);

  entrar(email: string, senha: string) {
    return signInWithEmailAndPassword(this.auth, email, senha);
  }

  sair() {
    return signOut(this.auth);
  }

  recuperarSenha(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }
}