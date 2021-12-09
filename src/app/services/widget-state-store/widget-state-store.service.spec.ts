import { TestBed } from '@angular/core/testing';

import { WidgetStateStoreService } from './widget-state-store.service';

describe('WidgetStoreService', () => {
  let service: WidgetStateStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WidgetStateStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
