import { HasContactPipe } from './has-contact.pipe';

describe('HasContactPipe', () => {
  it('create an instance', () => {
    const pipe = new HasContactPipe();
    expect(pipe).toBeTruthy();
  });
});
