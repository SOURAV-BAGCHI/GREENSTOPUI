import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleEmployeeDialogComponent } from './role-employee-dialog.component';

describe('RoleEmployeeDialogComponent', () => {
  let component: RoleEmployeeDialogComponent;
  let fixture: ComponentFixture<RoleEmployeeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleEmployeeDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleEmployeeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
