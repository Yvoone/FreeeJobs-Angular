import { TestBed } from '@angular/core/testing';

import { LogPublishersService } from './log-publishers.service';

describe('LogPublishersService', () => {
  let service: LogPublishersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogPublishersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
