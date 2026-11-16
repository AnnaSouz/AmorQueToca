import { Injectable } from '@angular/core';
import { Presenca } from '../modelos/presenca';

@Injectable({ providedIn: 'root' })
export class EvasaoService {
  readonly limiteDeFaltas = 3;

  // Recebe as presenças de um aluno e diz se as 3 mais recentes são faltas.
  estaEmRisco(presencas: Presenca[]): boolean {
    const recentes = [...presencas]
      .sort((a, b) => b.data.localeCompare(a.data))
      .slice(0, this.limiteDeFaltas);

    return (
      recentes.length === this.limiteDeFaltas &&
      recentes.every((presenca) => presenca.status === 'falta')
    );
  }
}