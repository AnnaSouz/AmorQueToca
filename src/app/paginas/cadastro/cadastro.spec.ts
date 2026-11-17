import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { Autenticacao, EmailNaoAutorizado } from '../../servicos/autenticacao';
import { Cadastro } from './cadastro';

describe('Cadastro', () => {
  let componente: Cadastro;
  let autenticacao: { cadastrar: ReturnType<typeof vi.fn> };
  let navegar: ReturnType<typeof vi.spyOn>;

  function preencher(senha = 'segredo1', confirmacao = senha) {
    componente.nome = '  Ana Souza ';
    componente.email = ' ana@exemplo.com ';
    componente.senha = senha;
    componente.confirmacao = confirmacao;
  }

  beforeEach(() => {
    autenticacao = { cadastrar: vi.fn().mockResolvedValue({}) };
    TestBed.configureTestingModule({
      imports: [Cadastro],
      providers: [provideRouter([]), { provide: Autenticacao, useValue: autenticacao }],
    });
    navegar = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    componente = TestBed.createComponent(Cadastro).componentInstance;
  });

  it('exige todos os campos', async () => {
    await componente.cadastrar();
    expect(componente.erro()).toBe('Preencha todos os campos.');
    expect(autenticacao.cadastrar).not.toHaveBeenCalled();
  });

  it('recusa senha com menos de 6 caracteres', async () => {
    preencher('12345');
    await componente.cadastrar();
    expect(componente.erro()).toContain('pelo menos 6');
    expect(autenticacao.cadastrar).not.toHaveBeenCalled();
  });

  it('recusa senhas diferentes', async () => {
    preencher('segredo1', 'segredo2');
    await componente.cadastrar();
    expect(componente.erro()).toBe('As senhas não são iguais.');
    expect(autenticacao.cadastrar).not.toHaveBeenCalled();
  });

  it('cria a conta e vai para o início', async () => {
    preencher();
    await componente.cadastrar();
    expect(autenticacao.cadastrar).toHaveBeenCalledWith('Ana Souza', 'ana@exemplo.com', 'segredo1');
    expect(navegar).toHaveBeenCalledWith(['/inicio']);
    expect(componente.erro()).toBe('');
  });

  it('avisa quando o e-mail não está na lista de autorizados', async () => {
    autenticacao.cadastrar.mockRejectedValue(new EmailNaoAutorizado());
    preencher();
    await componente.cadastrar();
    expect(componente.erro()).toContain('não está autorizado');
    expect(navegar).not.toHaveBeenCalled();
  });

  it('avisa quando o e-mail já tem conta', async () => {
    autenticacao.cadastrar.mockRejectedValue({ code: 'auth/email-already-in-use' });
    preencher();
    await componente.cadastrar();
    expect(componente.erro()).toBe('Este e-mail já tem conta. Use Entrar.');
    expect(navegar).not.toHaveBeenCalled();
    expect(componente.carregando()).toBe(false);
  });
});
