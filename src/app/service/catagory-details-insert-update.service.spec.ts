import { TestBed } from '@angular/core/testing';

import { CatagoryDetailsInsertUpdateService } from './catagory-details-insert-update.service';

describe('CatagoryDetailsInsertUpdateService', () => {
  let service: CatagoryDetailsInsertUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CatagoryDetailsInsertUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
