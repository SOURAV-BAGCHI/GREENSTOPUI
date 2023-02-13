import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscribeTestComponent } from './subscribe-test.component';

describe('SubscribeTestComponent', () => {
  let component: SubscribeTestComponent;
  let fixture: ComponentFixture<SubscribeTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscribeTestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscribeTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
