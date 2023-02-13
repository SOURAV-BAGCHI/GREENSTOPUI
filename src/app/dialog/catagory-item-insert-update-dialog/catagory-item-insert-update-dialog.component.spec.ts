import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatagoryItemInsertUpdateDialogComponent } from './catagory-item-insert-update-dialog.component';

describe('CatagoryItemInsertUpdateDialogComponent', () => {
  let component: CatagoryItemInsertUpdateDialogComponent;
  let fixture: ComponentFixture<CatagoryItemInsertUpdateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatagoryItemInsertUpdateDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CatagoryItemInsertUpdateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
