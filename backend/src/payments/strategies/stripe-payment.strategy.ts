import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { PaymentStrategy } from './payment.strategy';

@Injectable()
export class StripePaymentStrategy implements PaymentStrategy {
  private stripe: Stripe | null = null;

  constructor() {
    const key = process.env.STRIPE_SECRET_KEY;
    this.stripe = key ? new Stripe(key) : null;
  }

  async createPaymentIntent(amount: number, currency: string) {
    if (!this.stripe) {
      throw new Error('STRIPE_SECRET_KEY is missing');
    }

    const intent = await this.stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: { enabled: true },
    });

    return { clientSecret: intent.client_secret as string };
  }
}
