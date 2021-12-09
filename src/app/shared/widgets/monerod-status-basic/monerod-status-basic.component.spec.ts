import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonerodStatusBasicComponent } from './monerod-status-basic.component';

describe('MonerodStatusBasicComponent', () => {
  let component: MonerodStatusBasicComponent;
  let fixture: ComponentFixture<MonerodStatusBasicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonerodStatusBasicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonerodStatusBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
