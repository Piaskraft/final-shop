import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class OrdersCleanupJob {
  private readonly logger = new Logger(OrdersCleanupJob.name);

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  handle() {
    if (process.env.CRON_ENABLED !== 'true') return;
    this.logger.log('OrdersCleanupJob ran (CRON_ENABLED=true).');
  }
}
