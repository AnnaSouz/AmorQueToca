import { Presenca } from '../modelos/presenca';
import { EvasaoService } from './evasao-service';

function presenca(data: string, status: 'presente' | 'falta'): Presenca {
  return { id: `t_${data}_a1`, turmaId: 't', alunoId: 'a1', data, status };
}

describe('EvasaoService', () => {
  const servico = new EvasaoService();

  it('marca risco quando as 3 últimas aulas são faltas', () => {
    const historico = [
      presenca('2026-11-01', 'falta'),
      presenca('2026-11-08', 'falta'),
      presenca('2026-11-15', 'falta'),
    ];
    expect(servico.estaEmRisco(historico)).toBe(true);
  });

  it('não marca risco com apenas 2 faltas', () => {
    const historico = [presenca('2026-11-08', 'falta'), presenca('2026-11-15', 'falta')];
    expect(servico.estaEmRisco(historico)).toBe(false);
  });

  it('não marca risco quando há uma presença entre as faltas', () => {
    const historico = [
      presenca('2026-11-01', 'falta'),
      presenca('2026-11-08', 'presente'),
      presenca('2026-11-15', 'falta'),
    ];
    expect(servico.estaEmRisco(historico)).toBe(false);
  });

  it('usa as 3 aulas mais recentes, mesmo com o histórico fora de ordem', () => {
    const historico = [
      presenca('2026-11-15', 'falta'),
      presenca('2026-10-25', 'presente'),
      presenca('2026-11-08', 'falta'),
      presenca('2026-11-01', 'falta'),
    ];
    expect(servico.estaEmRisco(historico)).toBe(true);
  });
});