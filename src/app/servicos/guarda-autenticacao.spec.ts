import { TestBed } from '@angular/core/testing';
import { Router, UrlTree, provideRouter } from '@angular/router';
import { firstValueFrom, Observable, of } from 'rxjs';
import { Autenticacao } from './autenticacao';
import { guardaAutenticacao } from './guarda-autenticacao';

describe('guardaAutenticacao', () => {
  let usuario: { email: string } | null;
  let autenticacao: {
    usuarioAtual: () => Observable<{ email: string } | null>;
    emailAutorizado: ReturnType<typeof vi.fn>;
    sair: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    usuario = null;
    autenticacao = {
      usuarioAtual: () => of(usuario),
      emailAutorizado: vi.fn(),
      sair: vi.fn().mockResolvedValue(undefined),
    };
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: Autenticacao, useValue: autenticacao },
      ],
    });
  });

  function executar() {
    const resultado = TestBed.runInInjectionContext(() =>
      guardaAutenticacao({} as never, {} as never),
    ) as Observable<boolean | UrlTree>;
    return firstValueFrom(resultado);
  }

  function ehTelaLogin(valor: boolean | UrlTree) {
    return valor instanceof UrlTree && TestBed.inject(Router).serializeUrl(valor) === '/';
  }

  it('manda para o login quem não está logado', async () => {
    usuario = null;
    expect(ehTelaLogin(await executar())).toBe(true);
  });

  it('deixa entrar quem está logado e autorizado', async () => {
    usuario = { email: 'ana@exemplo.com' };
    autenticacao.emailAutorizado.mockResolvedValue(true);
    expect(await executar()).toBe(true);
  });

  it('desloga e manda para o login quem não está na lista', async () => {
    usuario = { email: 'intruso@exemplo.com' };
    autenticacao.emailAutorizado.mockResolvedValue(false);
    expect(ehTelaLogin(await executar())).toBe(true);
    expect(autenticacao.sair).toHaveBeenCalled();
  });

  it('não bloqueia quando a consulta falha sem internet', async () => {
    usuario = { email: 'ana@exemplo.com' };
    autenticacao.emailAutorizado.mockRejectedValue(new Error('offline'));
    expect(await executar()).toBe(true);
  });
});
