import { TestBed } from '@angular/core/testing';

import { RouteHandlerServiceService } from './route-handler-service.service';

describe('RouteHandlerServiceService', () => {
  let service: RouteHandlerServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RouteHandlerServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
