import { TestBed } from '@angular/core/testing';
import { RegistroChamada } from './registro-chamada';

describe('RegistroChamada', () => {
  let service: RegistroChamada;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistroChamada);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
