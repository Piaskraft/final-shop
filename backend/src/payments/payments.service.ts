import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { StripePaymentStrategy } from './strategies/stripe-payment.strategy';

@Injectable()
export class PaymentsService {
  constructor(private readonly strategy: StripePaymentStrategy) {}

  async createPaymentIntent(params: {
    amountEur: number;
    metadata?: Record<string, string>;
  }) {
    const amount = Math.round(params.amountEur * 100);

    try {
      // Strategy zwraca { clientSecret }
      const result = await this.strategy.createPaymentIntent(amount, 'eur');

      // Jeśli Twój controller oczekuje "intent", to zwracamy kompatybilny format:
      return {
        clientSecret: result.clientSecret,
      };
    } catch {
      throw new ServiceUnavailableException('Stripe is not configured');
    }
  }
}
