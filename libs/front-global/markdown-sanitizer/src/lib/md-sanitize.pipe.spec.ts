import { MdSanitizePipe } from './md-sanitize.pipe';

describe('MdSanitizePipe', () => {
  it('create an instance', () => {
    const pipe = new MdSanitizePipe();
    expect(pipe).toBeTruthy();
  });
});
