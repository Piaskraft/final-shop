import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { PaymentStrategy } from './payment.strategy';

@Injectable()
export class StripePaymentStrategy implements PaymentStrategy {
  private stripe: Stripe;

  constructor() {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY is missing');
    }
    this.stripe = new Stripe(key);
  }

  async createPaymentIntent(amount: number, currency: string) {
    const intent = await this.stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: { enabled: true },
    });

    return { clientSecret: intent.client_secret as string };
  }
}
