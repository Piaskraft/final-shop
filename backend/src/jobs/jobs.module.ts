import { Module } from '@nestjs/common';
import { OrdersCleanupJob } from './orders-cleanup.job';

@Module({
  providers: [OrdersCleanupJob],
})
export class JobsModule {}
