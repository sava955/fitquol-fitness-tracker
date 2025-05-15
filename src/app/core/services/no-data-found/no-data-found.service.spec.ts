import { TestBed } from '@angular/core/testing';

import { NoDataFoundService } from './no-data-found.service';

describe('NoDataFoundService', () => {
  let service: NoDataFoundService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NoDataFoundService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
