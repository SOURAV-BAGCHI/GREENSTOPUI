import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavDialogComponent } from './sidenav-dialog.component';

describe('SidenavDialogComponent', () => {
  let component: SidenavDialogComponent;
  let fixture: ComponentFixture<SidenavDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidenavDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenavDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
