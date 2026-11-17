import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Aluno } from '../../modelos/aluno';
import { TURMA_ATUAL } from '../../modelos/turma';
import { RepositorioAlunos } from '../../repositorios/repositorio-alunos';
import { Alunos } from './alunos';

describe('Alunos', () => {
  const lista: Aluno[] = [
    { id: 'a1', nome: 'Ana Ribeiro' },
    { id: 'a2', nome: 'João Lima' },
  ];

  let componente: Alunos;
  let repositorio: {
    observarAtivos: () => Observable<Aluno[]>;
    adicionar: ReturnType<typeof vi.fn>;
    renomear: ReturnType<typeof vi.fn>;
    remover: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    repositorio = {
      observarAtivos: () => of(lista),
      adicionar: vi.fn().mockResolvedValue(undefined),
      renomear: vi.fn().mockResolvedValue(undefined),
      remover: vi.fn().mockResolvedValue(undefined),
    };
    TestBed.configureTestingModule({
      imports: [Alunos],
      providers: [provideRouter([]), { provide: RepositorioAlunos, useValue: repositorio }],
    });
    componente = TestBed.createComponent(Alunos).componentInstance;
  });

  it('mostra os alunos da turma', () => {
    expect(componente.alunos()).toEqual(lista);
  });

  it('adiciona com o nome limpo e esvazia o campo', async () => {
    componente.novoNome = '  Maria   Clara  ';
    await componente.adicionar();
    expect(repositorio.adicionar).toHaveBeenCalledWith(TURMA_ATUAL.id, 'Maria Clara');
    expect(componente.novoNome).toBe('');
    expect(componente.erro()).toBe('');
  });

  it('não adiciona nome vazio', async () => {
    componente.novoNome = '   ';
    await componente.adicionar();
    expect(componente.erro()).toBe('Digite o nome do aluno.');
    expect(repositorio.adicionar).not.toHaveBeenCalled();
  });

  it('não adiciona nome repetido, sem diferenciar maiúsculas e acentos', async () => {
    componente.novoNome = 'joao lima';
    await componente.adicionar();
    expect(componente.erro()).toBe('Já existe um aluno com esse nome.');
    expect(repositorio.adicionar).not.toHaveBeenCalled();
  });

  it('renomeia um aluno', async () => {
    componente.editar(lista[0]);
    expect(componente.editandoId()).toBe('a1');
    componente.nomeEditado = 'Ana Ribeiro Souza';
    await componente.salvarEdicao(lista[0]);
    expect(repositorio.renomear).toHaveBeenCalledWith(TURMA_ATUAL.id, 'a1', 'Ana Ribeiro Souza');
    expect(componente.editandoId()).toBeNull();
  });

  it('não renomeia para o nome de outro aluno', async () => {
    componente.editar(lista[0]);
    componente.nomeEditado = 'João Lima';
    await componente.salvarEdicao(lista[0]);
    expect(componente.erro()).toBe('Já existe um aluno com esse nome.');
    expect(repositorio.renomear).not.toHaveBeenCalled();
  });

  it('só remove depois da confirmação', async () => {
    componente.pedirRemocao(lista[1]);
    expect(componente.removendoId()).toBe('a2');
    expect(repositorio.remover).not.toHaveBeenCalled();

    await componente.confirmarRemocao(lista[1]);
    expect(repositorio.remover).toHaveBeenCalledWith(TURMA_ATUAL.id, 'a2');
    expect(componente.removendoId()).toBeNull();
  });

  it('cancelar a remoção não remove', () => {
    componente.pedirRemocao(lista[1]);
    componente.cancelarRemocao();
    expect(componente.removendoId()).toBeNull();
    expect(repositorio.remover).not.toHaveBeenCalled();
  });
});
