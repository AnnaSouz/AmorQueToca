import { TestBed } from '@angular/core/testing';
import { RepositorioPresencas } from './repositorio-presencas';

describe('RepositorioPresencas', () => {
  let service: RepositorioPresencas;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RepositorioPresencas);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
