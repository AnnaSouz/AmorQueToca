export interface Turma {
  id: string;
  nome: string;
  horario: string;
}

/** O app atende uma turma por enquanto. */
export const TURMA_ATUAL: Turma = {
  id: 'turma-violao-iniciante',
  nome: 'Violão Iniciante',
  horario: 'Sábado, 9h',
};
