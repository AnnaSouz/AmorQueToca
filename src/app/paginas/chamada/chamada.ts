import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { Aluno } from '../../modelos/aluno';
import { RegistroChamada } from '../../servicos/registro-chamada';

@Component({
  selector: 'app-chamada',
  imports: [MatButtonModule],
  styleUrl: './chamada.css',
  templateUrl: './chamada.html',
})
export class Chamada {
  private roteador = inject(Router);
  private registroChamada = inject(RegistroChamada);

  
  turmaId = 'turma-violao-iniciante';
  turma = { nome: 'Violão Iniciante', horario: 'Sábado, 9h' };
  alunos: Aluno[] = [
    { id: 'a1', nome: 'Ana Ribeiro' },
    { id: 'a2', nome: 'Bia Ferreira' },
    { id: 'a3', nome: 'Davi Oliveira' },
    { id: 'a4', nome: 'Enzo Rocha' },
    { id: 'a5', nome: 'Gabriel Costa' },
    { id: 'a6', nome: 'Helena Dias' },
    { id: 'a7', nome: 'Laura Mendes' },
    { id: 'a8', nome: 'Lucas Andrade' },
    { id: 'a9', nome: 'Maria Clara Santos' },
    { id: 'a10', nome: 'Sofia Ramos' },
  ];

  faltas = signal<Set<string>>(new Set());
  mensagem = signal('');
  erro = signal('');

  totalFaltas = computed(() => this.faltas().size);
  totalPresentes = computed(() => this.alunos.length - this.faltas().size);

  estaFaltando(id: string) {
    return this.faltas().has(id);
  }

  alternar(id: string) {
    this.faltas.update((atual) => {
      const novo = new Set(atual);
      if (novo.has(id)) {
        novo.delete(id);
      } else {
        novo.add(id);
      }
      return novo;
    });
    this.mensagem.set('');
    this.erro.set('');
  }

  async salvar() {
    this.mensagem.set('');
    this.erro.set('');
    const gravacao = this.registroChamada.salvar(this.turmaId, this.alunos, this.faltas());

    if (navigator.onLine) {
      try {
        await gravacao;
        this.mensagem.set('Chamada salva.');
      } catch {
        this.erro.set('Não foi possível salvar a chamada. Tente de novo.');
      }
    } else {
     
      gravacao.catch(() => this.erro.set('Não foi possível salvar a chamada. Tente de novo.'));
      this.mensagem.set('Chamada salva. Será enviada quando houver internet.');
    }
  }

  voltar() {
    this.roteador.navigate(['/inicio']);
  }
}