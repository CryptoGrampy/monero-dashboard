import { TestBed } from '@angular/core/testing';

import { MonerodControllerService } from './monerod-controller.service';

describe('MonerodControllerService', () => {
  let service: MonerodControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MonerodControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
