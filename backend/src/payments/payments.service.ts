import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe | null;

  constructor() {
    const key = process.env.STRIPE_SECRET_KEY;
    this.stripe = key ? new Stripe(key) : null;
  }

  async createPaymentIntent(params: {
    amountEur: number;
    metadata?: Record<string, string>;
  }) {
    if (!this.stripe) {
      throw new ServiceUnavailableException('Stripe is not configured');
    }

    const amount = Math.round(params.amountEur * 100);

    const intent = await this.stripe.paymentIntents.create({
      amount,
      currency: 'eur',
      automatic_payment_methods: { enabled: true },
      metadata: params.metadata,
    });

    return intent;
  }
}
