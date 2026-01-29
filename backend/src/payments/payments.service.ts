import { Injectable } from '@nestjs/common';
import { StripePaymentStrategy } from './strategies/stripe-payment.strategy';

@Injectable()
export class PaymentsService {
  constructor(private readonly strategy: StripePaymentStrategy) {}

  async createPaymentIntent(params: {
    amountEur: number;
    metadata?: Record<string, string>;
  }) {
    const amount = Math.round(params.amountEur * 100);

    const { clientSecret } = await this.strategy.createPaymentIntent(
      amount,
      'eur',
    );

    return { clientSecret };
  }
}
