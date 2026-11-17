import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Autenticacao, EmailNaoAutorizado } from '../../servicos/autenticacao';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink, MatButtonModule, MatFormFieldModule, MatInputModule],
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private autenticacao = inject(Autenticacao);
  private roteador = inject(Router);

  email = '';
  senha = '';
  mostrarSenha = signal(false);
  erro = signal('');
  carregando = signal(false);
  sucesso = signal(false);

  alternarSenha() {
    this.mostrarSenha.update((valor) => !valor);
  }

  async entrar() {
    if (!this.email || !this.senha) {
      this.erro.set('Preencha o e-mail e a senha.');
      return;
    }
    this.erro.set('');
    this.sucesso.set(false);
    this.carregando.set(true);
    try {
      await this.autenticacao.entrar(this.email.trim(), this.senha);
      this.roteador.navigate(['/inicio']);
    } catch (e) {
      this.erro.set(
        e instanceof EmailNaoAutorizado
          ? 'Este e-mail não está autorizado. Fale com a coordenação do projeto.'
          : 'E-mail ou senha incorretos. Confira ou use Esqueci minha senha.',
      );
    } finally {
      this.carregando.set(false);
    }
  }
}