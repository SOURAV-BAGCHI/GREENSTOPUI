import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VOtpAndCompleteOComponent } from './v-otp-and-complete-o.component';

describe('VOtpAndCompleteOComponent', () => {
  let component: VOtpAndCompleteOComponent;
  let fixture: ComponentFixture<VOtpAndCompleteOComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VOtpAndCompleteOComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VOtpAndCompleteOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
