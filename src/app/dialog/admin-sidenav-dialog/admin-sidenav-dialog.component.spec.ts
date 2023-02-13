import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSidenavDialogComponent } from './admin-sidenav-dialog.component';

describe('AdminSidenavDialogComponent', () => {
  let component: AdminSidenavDialogComponent;
  let fixture: ComponentFixture<AdminSidenavDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminSidenavDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSidenavDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
