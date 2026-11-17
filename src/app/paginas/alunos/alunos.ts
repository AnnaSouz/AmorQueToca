import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Aluno } from '../../modelos/aluno';
import { TURMA_ATUAL } from '../../modelos/turma';
import { RepositorioAlunos } from '../../repositorios/repositorio-alunos';

function normalizar(nome: string) {
  return nome.trim().toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[̀-ͯ]/g, '');
}

@Component({
  selector: 'app-alunos',
  imports: [FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  styleUrl: './alunos.css',
  templateUrl: './alunos.html',
})
export class Alunos {
  private roteador = inject(Router);
  private repositorio = inject(RepositorioAlunos);

  turma = TURMA_ATUAL;
  alunos = toSignal(this.repositorio.observarAtivos(this.turma.id), { initialValue: [] as Aluno[] });

  novoNome = '';
  nomeEditado = '';
  editandoId = signal<string | null>(null);
  removendoId = signal<string | null>(null);
  mensagem = signal('');
  erro = signal('');

  /** Devolve o nome limpo, ou mostra o erro e devolve null. */
  private validar(nome: string, ignorarId?: string): string | null {
    const limpo = nome.trim().replace(/\s+/g, ' ');
    if (!limpo) {
      this.erro.set('Digite o nome do aluno.');
      return null;
    }
    const repetido = this.alunos().some((a) => a.id !== ignorarId && normalizar(a.nome) === normalizar(limpo));
    if (repetido) {
      this.erro.set('Já existe um aluno com esse nome.');
      return null;
    }
    return limpo;
  }

  /** Sem internet, o Firestore guarda a alteração e envia depois; não dá para esperar a confirmação. */
  private async gravar(gravacao: Promise<unknown>, sucesso: string) {
    if (navigator.onLine) {
      try {
        await gravacao;
        this.mensagem.set(sucesso);
      } catch {
        this.erro.set('Não foi possível salvar. Tente de novo.');
      }
    } else {
      gravacao.catch(() => this.erro.set('Não foi possível salvar. Tente de novo.'));
      this.mensagem.set(`${sucesso} Será enviado quando houver internet.`);
    }
  }

  private limparAvisos() {
    this.mensagem.set('');
    this.erro.set('');
  }

  async adicionar() {
    this.limparAvisos();
    const nome = this.validar(this.novoNome);
    if (!nome) {
      return;
    }
    this.novoNome = '';
    await this.gravar(this.repositorio.adicionar(this.turma.id, nome), `${nome} foi adicionado(a).`);
  }

  editar(aluno: Aluno) {
    this.limparAvisos();
    this.removendoId.set(null);
    this.editandoId.set(aluno.id);
    this.nomeEditado = aluno.nome;
  }

  cancelarEdicao() {
    this.editandoId.set(null);
    this.erro.set('');
  }

  async salvarEdicao(aluno: Aluno) {
    this.limparAvisos();
    const nome = this.validar(this.nomeEditado, aluno.id);
    if (!nome) {
      return;
    }
    this.editandoId.set(null);
    if (nome === aluno.nome) {
      return;
    }
    await this.gravar(this.repositorio.renomear(this.turma.id, aluno.id, nome), 'Nome atualizado.');
  }

  pedirRemocao(aluno: Aluno) {
    this.limparAvisos();
    this.editandoId.set(null);
    this.removendoId.set(aluno.id);
  }

  cancelarRemocao() {
    this.removendoId.set(null);
  }

  async confirmarRemocao(aluno: Aluno) {
    this.limparAvisos();
    this.removendoId.set(null);
    await this.gravar(this.repositorio.remover(this.turma.id, aluno.id), `${aluno.nome} saiu da lista.`);
  }

  voltar() {
    this.roteador.navigate(['/inicio']);
  }
}
