import { TestBed } from '@angular/core/testing';

import { FirebaseCloudMessagingService } from './firebase-cloud-messaging.service';

describe('FirebaseCloudMessagingService', () => {
  let service: FirebaseCloudMessagingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseCloudMessagingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
