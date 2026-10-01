import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    jest.useFakeTimers();
    service = new ToastService();
  });

  afterEach(() => {
    service.clear();
    jest.useRealTimers();
  });

  it('auto-dismisses transient messages after the configured life', () => {
    service.add({ severity: 'success', summary: 'Saved', life: 500 });

    jest.advanceTimersByTime(499);
    expect(service.messages()).toHaveLength(1);

    jest.advanceTimersByTime(1);
    expect(service.messages()[0].closing).toBe(true);

    jest.advanceTimersByTime(180);
    expect(service.messages()).toHaveLength(0);
  });

  it('keeps sticky messages until dismissed', () => {
    service.add({ severity: 'warn', summary: 'Check this', sticky: true });

    jest.advanceTimersByTime(60_000);
    expect(service.messages()).toHaveLength(1);

    service.dismiss(service.messages()[0].id);
    expect(service.messages()[0].closing).toBe(true);

    jest.advanceTimersByTime(180);
    expect(service.messages()).toHaveLength(0);
  });

  it('clears only messages matching a key', () => {
    service.add({ severity: 'info', summary: 'A', key: 'group-a' });
    service.add({ severity: 'error', summary: 'B', key: 'group-b' });

    service.clear('group-a');

    expect(service.messages().map((message) => message.summary)).toEqual(['B']);
  });
});