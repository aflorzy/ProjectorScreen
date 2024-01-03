import { TestBed } from '@angular/core/testing';

import { ImageSliceService } from './image-slice.service';

describe('ImageSliceService', () => {
  let service: ImageSliceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageSliceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
