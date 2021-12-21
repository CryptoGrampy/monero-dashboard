import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonerochanSlideshowComponent } from './monerochan-slideshow.component';

describe('MonerochanSlideshowComponent', () => {
  let component: MonerochanSlideshowComponent;
  let fixture: ComponentFixture<MonerochanSlideshowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonerochanSlideshowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonerochanSlideshowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
