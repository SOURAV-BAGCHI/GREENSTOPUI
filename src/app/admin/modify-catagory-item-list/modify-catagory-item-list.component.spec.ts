import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyCatagoryItemListComponent } from './modify-catagory-item-list.component';

describe('ModifyCatagoryItemListComponent', () => {
  let component: ModifyCatagoryItemListComponent;
  let fixture: ComponentFixture<ModifyCatagoryItemListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyCatagoryItemListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyCatagoryItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
