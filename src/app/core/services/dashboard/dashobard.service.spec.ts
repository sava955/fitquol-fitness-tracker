import { TestBed } from '@angular/core/testing';

import { DashobardService } from './dashobard.service';

describe('DashobardService', () => {
  let service: DashobardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashobardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
