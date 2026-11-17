import { Injectable, inject } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { take } from 'rxjs';

export class EmailNaoAutorizado extends Error {
  readonly code = 'app/email-nao-autorizado';
}

@Injectable({ providedIn: 'root' })
export class Autenticacao {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  /** Usuário logado no momento (emite uma vez, depois que o Firebase restaura a sessão). */
  usuarioAtual() {
    return authState(this.auth).pipe(take(1));
  }

  /** Consulta a coleção `emailsAutorizados` (ID do documento = e-mail em minúsculas). */
  async emailAutorizado(email: string) {
    const registro = await getDoc(doc(this.firestore, 'emailsAutorizados', email.trim().toLowerCase()));
    return registro.exists();
  }

  async entrar(email: string, senha: string) {
    const credencial = await signInWithEmailAndPassword(this.auth, email, senha);
    if (!(await this.emailAutorizado(email))) {
      await signOut(this.auth);
      throw new EmailNaoAutorizado();
    }
    return credencial;
  }

  async cadastrar(nome: string, email: string, senha: string) {
    if (!(await this.emailAutorizado(email))) {
      throw new EmailNaoAutorizado();
    }
    const credencial = await createUserWithEmailAndPassword(this.auth, email, senha);
    await updateProfile(credencial.user, { displayName: nome });
    return credencial;
  }

  nomeUsuario() {
    const usuario = this.auth.currentUser;
    return usuario?.displayName || usuario?.email?.split('@')[0] || 'Professor';
  }

  sair() {
    return signOut(this.auth);
  }

  recuperarSenha(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }
}
