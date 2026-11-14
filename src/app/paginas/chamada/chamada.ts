import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { Aluno } from '../../modelos/aluno';

@Component({
  selector: 'app-chamada',
  imports: [MatButtonModule],
  styleUrl: './chamada.css',
  templateUrl: './chamada.html',
})
export class Chamada {
  private roteador = inject(Router);

  // Dados de exemplo (fictícios). Depois virão do Firestore.
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

  // Guarda os ids de quem faltou. Todo mundo começa como presente.
  faltas = signal<Set<string>>(new Set());
  mensagem = signal('');

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
  }

  salvar() {
    this.mensagem.set('Chamada salva neste teste. A gravação no Firebase vem no próximo passo.');
  }

  voltar() {
    this.roteador.navigate(['/inicio']);
  }
}