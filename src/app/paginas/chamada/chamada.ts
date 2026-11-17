import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { Aluno } from '../../modelos/aluno';
import { TURMA_ATUAL } from '../../modelos/turma';
import { RepositorioAlunos } from '../../repositorios/repositorio-alunos';
import { RegistroChamada } from '../../servicos/registro-chamada';

@Component({
  selector: 'app-chamada',
  imports: [MatButtonModule, RouterLink],
  styleUrl: './chamada.css',
  templateUrl: './chamada.html',
})
export class Chamada {
  private roteador = inject(Router);
  private registroChamada = inject(RegistroChamada);
  private repositorioAlunos = inject(RepositorioAlunos);

  turma = TURMA_ATUAL;
  alunos = toSignal(this.repositorioAlunos.observarAtivos(this.turma.id), { initialValue: [] as Aluno[] });

  faltas = signal<Set<string>>(new Set());
  mensagem = signal('');
  erro = signal('');

  // Só conta faltas de quem ainda está na lista (um aluno pode ser removido durante a chamada).
  totalFaltas = computed(() => this.alunos().filter((aluno) => this.faltas().has(aluno.id)).length);
  totalPresentes = computed(() => this.alunos().length - this.totalFaltas());

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
    const gravacao = this.registroChamada.salvar(this.turma.id, this.alunos(), this.faltas());

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