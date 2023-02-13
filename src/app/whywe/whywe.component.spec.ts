import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhyweComponent } from './whywe.component';

describe('WhyweComponent', () => {
  let component: WhyweComponent;
  let fixture: ComponentFixture<WhyweComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhyweComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WhyweComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
