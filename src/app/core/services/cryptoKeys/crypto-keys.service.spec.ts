import { TestBed } from '@angular/core/testing';

import { CryptoKeysService } from './crypto-keys.service';

describe('CryptoKeysService', () => {
  let service: CryptoKeysService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CryptoKeysService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
