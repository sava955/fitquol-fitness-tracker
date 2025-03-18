import { TestBed } from '@angular/core/testing';

import { LocalSpinnerService } from './local-spinner.service';

describe('LocalSpinnerService', () => {
  let service: LocalSpinnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalSpinnerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
