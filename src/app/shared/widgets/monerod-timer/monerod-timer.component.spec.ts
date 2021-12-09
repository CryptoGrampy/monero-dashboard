import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonerodTimerComponent } from './monerod-timer.component';

describe('TimerComponent', () => {
  let component: MonerodTimerComponent;
  let fixture: ComponentFixture<MonerodTimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonerodTimerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonerodTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
