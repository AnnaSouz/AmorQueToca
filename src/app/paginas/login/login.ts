import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Autenticacao } from '../../servicos/autenticacao';

@Component({
  selector: 'app-login',
  imports: [FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private autenticacao = inject(Autenticacao);

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
      this.sucesso.set(true);
    } catch {
      this.erro.set('E-mail ou senha incorretos. Confira ou use Esqueci minha senha.');
    } finally {
      this.carregando.set(false);
    }
  }
}