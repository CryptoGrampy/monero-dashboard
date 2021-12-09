import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonerodControllerComponent } from './monerod-controller.component';

describe('MonerodControllerComponent', () => {
  let component: MonerodControllerComponent;
  let fixture: ComponentFixture<MonerodControllerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonerodControllerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonerodControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
