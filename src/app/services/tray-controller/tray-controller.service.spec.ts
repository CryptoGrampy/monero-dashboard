import { TestBed } from '@angular/core/testing';

import { TrayControllerService } from './tray-controller.service';

describe('TrayControllerService', () => {
  let service: TrayControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrayControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
