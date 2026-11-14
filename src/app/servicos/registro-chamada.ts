import { Injectable, inject } from '@angular/core';
import { Aluno } from '../modelos/aluno';
import { Presenca } from '../modelos/presenca';
import { RepositorioPresencas } from '../repositorios/repositorio-presencas';

@Injectable({ providedIn: 'root' })
export class RegistroChamada {
  private repositorio = inject(RepositorioPresencas);

  dataDeHoje(): string {
    const agora = new Date();
    const mes = String(agora.getMonth() + 1).padStart(2, '0');
    const dia = String(agora.getDate()).padStart(2, '0');
    return `${agora.getFullYear()}-${mes}-${dia}`;
  }

  salvar(turmaId: string, alunos: Aluno[], faltas: Set<string>): Promise<void> {
    if (alunos.length === 0) {
      return Promise.reject(new Error('A turma não tem alunos.'));
    }
    const data = this.dataDeHoje();
    const presencas = alunos.map(
      (aluno): Presenca => ({
        id: `${turmaId}_${data}_${aluno.id}`,
        turmaId,
        alunoId: aluno.id,
        data,
        status: faltas.has(aluno.id) ? 'falta' : 'presente',
      }),
    );
    return this.repositorio.gravarVarias(presencas);
  }
}