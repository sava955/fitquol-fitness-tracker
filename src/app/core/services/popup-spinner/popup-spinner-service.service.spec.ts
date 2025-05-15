import { TestBed } from '@angular/core/testing';

import { PopupSpinnerServiceService } from './popup-spinner-service.service';

describe('PopupSpinnerServiceService', () => {
  let service: PopupSpinnerServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PopupSpinnerServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
