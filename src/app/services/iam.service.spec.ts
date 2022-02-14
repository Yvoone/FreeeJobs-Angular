import { TestBed } from '@angular/core/testing';

import { IAMService } from './iam.service';

describe('IAMService', () => {
  let service: IAMService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IAMService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
