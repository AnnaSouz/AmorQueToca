import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Autenticacao } from '../../servicos/autenticacao';

@Component({
  selector: 'app-inicio',
  imports: [MatButtonModule, MatCardModule],
  styleUrl: './inicio.css',
  templateUrl: './inicio.html',
})
export class Inicio {
  private autenticacao = inject(Autenticacao);
  private roteador = inject(Router);

  // Dados de exemplo (fictícios). Depois serão trocados por dados do Firestore.
  professor = 'Paulo';
  turma = { nome: 'Violão Iniciante', horario: 'Sábado, 9h', alunos: 10 };
  alunosEmRisco = 2;
  instrumentosEmprestados = 1;
  instrumentosTotal = 4;

  async sair() {
    await this.autenticacao.sair();
    this.roteador.navigate(['/']);
  }
}