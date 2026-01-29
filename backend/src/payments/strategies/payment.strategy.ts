export interface PaymentStrategy {
  createPaymentIntent(
    amount: number,
    currency: string,
  ): Promise<{ clientSecret: string }>;
}
