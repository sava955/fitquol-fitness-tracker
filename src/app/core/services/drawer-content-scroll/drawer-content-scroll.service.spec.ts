import { TestBed } from '@angular/core/testing';

import { DrawerContentScrollService } from './drawer-content-scroll.service';

describe('DrawerContentScrollService', () => {
  let service: DrawerContentScrollService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DrawerContentScrollService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
