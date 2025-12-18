import { TestBed } from '@angular/core/testing';

import { AccesslogService } from './accesslog.service';

describe('AccesslogService', () => {
  let service: AccesslogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccesslogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
