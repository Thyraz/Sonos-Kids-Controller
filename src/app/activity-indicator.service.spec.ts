import { TestBed } from '@angular/core/testing';

import { ActivityIndicatorService } from './activity-indicator.service';

describe('ActivityIndicatorService', () => {
  let service: ActivityIndicatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivityIndicatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
