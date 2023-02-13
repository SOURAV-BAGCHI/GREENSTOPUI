import { TestBed } from '@angular/core/testing';

import { CatagoryDetailsService } from './catagory-details.service';

describe('CatagoryDetailsService', () => {
  let service: CatagoryDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CatagoryDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
