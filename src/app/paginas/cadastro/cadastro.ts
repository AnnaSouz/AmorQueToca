import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Autenticacao } from '../../servicos/autenticacao';

const SENHA_MINIMA = 6;

const MENSAGENS_FIREBASE: Record<string, string> = {
  'app/email-nao-autorizado':
    'Este e-mail não está autorizado. Peça à coordenação do projeto para liberar seu acesso.',
  'auth/email-already-in-use': 'Este e-mail já tem conta. Use Entrar.',
  'auth/invalid-email': 'E-mail inválido. Confira o endereço digitado.',
  'auth/weak-password': `A senha precisa ter pelo menos ${SENHA_MINIMA} caracteres.`,
  'auth/network-request-failed': 'Sem conexão com a internet. Tente de novo.',
};

@Component({
  selector: 'app-cadastro',
  imports: [FormsModule, RouterLink, MatButtonModule, MatFormFieldModule, MatInputModule],
  styleUrl: './cadastro.css',
  templateUrl: './cadastro.html',
})
export class Cadastro {
  private autenticacao = inject(Autenticacao);
  private roteador = inject(Router);

  nome = '';
  email = '';
  senha = '';
  confirmacao = '';
  mostrarSenha = signal(false);
  erro = signal('');
  carregando = signal(false);

  alternarSenha() {
    this.mostrarSenha.update((valor) => !valor);
  }

  async cadastrar() {
    const nome = this.nome.trim();
    const email = this.email.trim();

    if (!nome || !email || !this.senha || !this.confirmacao) {
      this.erro.set('Preencha todos os campos.');
      return;
    }
    if (this.senha.length < SENHA_MINIMA) {
      this.erro.set(`A senha precisa ter pelo menos ${SENHA_MINIMA} caracteres.`);
      return;
    }
    if (this.senha !== this.confirmacao) {
      this.erro.set('As senhas não são iguais.');
      return;
    }

    this.erro.set('');
    this.carregando.set(true);
    try {
      await this.autenticacao.cadastrar(nome, email, this.senha);
      this.roteador.navigate(['/inicio']);
    } catch (e) {
      const codigo = (e as { code?: string })?.code ?? '';
      this.erro.set(MENSAGENS_FIREBASE[codigo] ?? 'Não foi possível criar a conta. Tente de novo.');
    } finally {
      this.carregando.set(false);
    }
  }
}
