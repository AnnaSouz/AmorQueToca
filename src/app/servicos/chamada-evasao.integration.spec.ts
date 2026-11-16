import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { Aluno } from '../modelos/aluno';
import { Presenca } from '../modelos/presenca';
import { RepositorioPresencas } from '../repositorios/repositorio-presencas';
import { EvasaoService } from './evasao-service';
import { RegistroChamada } from './registro-chamada';

// Repositório de mentira: guarda as presenças na memória, sem usar o Firebase.
class RepositorioEmMemoria {
  dados = new Map<string, Presenca>();

  async gravarVarias(presencas: Presenca[]): Promise<void> {
    for (const presenca of presencas) {
      this.dados.set(presenca.id, presenca);
    }
  }

  doAluno(alunoId: string): Presenca[] {
    return [...this.dados.values()].filter((presenca) => presenca.alunoId === alunoId);
  }
}

describe('Integração: registro de chamada e alerta de evasão', () => {
  const alunos: Aluno[] = [
    { id: 'a1', nome: 'Aluno Um' },
    { id: 'a2', nome: 'Aluno Dois' },
  ];

  let repositorio: RepositorioEmMemoria;
  let registro: RegistroChamada;
  let evasao: EvasaoService;

  beforeEach(() => {
    repositorio = new RepositorioEmMemoria();
    TestBed.configureTestingModule({
      providers: [{ provide: RepositorioPresencas, useValue: repositorio }],
    });
    registro = TestBed.inject(RegistroChamada);
    evasao = TestBed.inject(EvasaoService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Simula uma chamada feita em uma data específica.
  async function fazerChamada(data: string, faltas: string[]) {
    vi.spyOn(registro, 'dataDeHoje').mockReturnValue(data);
    await registro.salvar('turma-1', alunos, new Set(faltas));
  }

  it('gera alerta para o aluno que faltou em 3 chamadas seguidas', async () => {
    await fazerChamada('2026-11-01', ['a1']);
    await fazerChamada('2026-11-08', ['a1']);
    await fazerChamada('2026-11-15', ['a1']);

    expect(evasao.estaEmRisco(repositorio.doAluno('a1'))).toBe(true);
    expect(evasao.estaEmRisco(repositorio.doAluno('a2'))).toBe(false);
  });

  it('não gera alerta quando o aluno comparece no meio das faltas', async () => {
    await fazerChamada('2026-11-01', ['a1']);
    await fazerChamada('2026-11-08', []);
    await fazerChamada('2026-11-15', ['a1']);

    expect(evasao.estaEmRisco(repositorio.doAluno('a1'))).toBe(false);
  });

  it('atualiza a chamada do mesmo dia sem duplicar registros', async () => {
    await fazerChamada('2026-11-15', ['a1']);
    await fazerChamada('2026-11-15', []);

    expect(repositorio.dados.size).toBe(2);
    expect(repositorio.doAluno('a1')[0].status).toBe('presente');
  });

  it('recusa salvar uma chamada de turma sem alunos', async () => {
    await expect(registro.salvar('turma-1', [], new Set())).rejects.toThrow();
    expect(repositorio.dados.size).toBe(0);
  });
});