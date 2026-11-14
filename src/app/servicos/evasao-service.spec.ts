import { TestBed } from '@angular/core/testing';
import { EvasaoService } from './evasao-service';

describe('EvasaoService', () => {
  let service: EvasaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EvasaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
