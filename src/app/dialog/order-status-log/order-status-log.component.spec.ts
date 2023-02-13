import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderStatusLogComponent } from './order-status-log.component';

describe('OrderStatusLogComponent', () => {
  let component: OrderStatusLogComponent;
  let fixture: ComponentFixture<OrderStatusLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderStatusLogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderStatusLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
