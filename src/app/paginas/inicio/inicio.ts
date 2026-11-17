import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Aluno } from '../../modelos/aluno';
import { TURMA_ATUAL } from '../../modelos/turma';
import { RepositorioAlunos } from '../../repositorios/repositorio-alunos';
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
  private repositorioAlunos = inject(RepositorioAlunos);

  professor = this.autenticacao.nomeUsuario();
  turma = TURMA_ATUAL;
  alunos = toSignal(this.repositorioAlunos.observarAtivos(this.turma.id), { initialValue: [] as Aluno[] });
  alunosEmRisco = 2;
  instrumentosEmprestados = 1;
  instrumentosTotal = 4;

  fazerChamada() {
    this.roteador.navigate(['/chamada']);
  }

  gerenciarAlunos() {
    this.roteador.navigate(['/alunos']);
  }

  async sair() {
    await this.autenticacao.sair();
    this.roteador.navigate(['/']);
  }
}