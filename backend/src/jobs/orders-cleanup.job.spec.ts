import { Logger } from '@nestjs/common';
import { OrdersCleanupJob } from './orders-cleanup.job';

describe('OrdersCleanupJob', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.restoreAllMocks();
    process.env = { ...OLD_ENV };
    delete process.env.CRON_ENABLED;
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('does nothing when CRON_ENABLED is not true', () => {
    const logSpy = jest
      .spyOn(Logger.prototype, 'log')
      .mockImplementation(() => undefined);

    const job = new OrdersCleanupJob();
    job.handle();

    expect(logSpy).not.toHaveBeenCalled();
  });

  it('logs when CRON_ENABLED is true', () => {
    process.env.CRON_ENABLED = 'true';

    const logSpy = jest
      .spyOn(Logger.prototype, 'log')
      .mockImplementation(() => undefined);

    const job = new OrdersCleanupJob();
    job.handle();

    expect(logSpy).toHaveBeenCalledWith(
      'OrdersCleanupJob ran (CRON_ENABLED=true).',
    );
  });
});
