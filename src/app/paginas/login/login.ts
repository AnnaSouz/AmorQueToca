import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-login',
  imports: [FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  email = '';
  senha = '';
  mostrarSenha = signal(false);
  erro = signal('');

  alternarSenha() {
    this.mostrarSenha.update((valor) => !valor);
  }

  entrar() {
    if (!this.email || !this.senha) {
      this.erro.set('Preencha o e-mail e a senha.');
      return;
    }
    this.erro.set('');
  }
}