import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { OrdersModule } from '../orders/orders.module';
import { StripePaymentStrategy } from './strategies/stripe-payment.strategy';

@Module({
  imports: [OrdersModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, StripePaymentStrategy],
})
export class PaymentsModule {}
