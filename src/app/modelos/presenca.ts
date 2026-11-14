export interface Presenca {
  id: string;
  turmaId: string;
  alunoId: string;
  data: string;
  status: 'presente' | 'falta';
}