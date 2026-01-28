import { ServiceUnavailableException } from '@nestjs/common';
import Stripe from 'stripe';
import { PaymentsService } from './payments.service';
import { PaymentsModule } from './payments.module';

type StripeIntent = { id: string; client_secret: string };
type PaymentIntentCreateParams = {
  amount: number;
  currency: 'eur';
  automatic_payment_methods: { enabled: boolean };
  metadata?: Record<string, string>;
};

const paymentIntentsCreateMock = jest.fn<
  Promise<StripeIntent>,
  [PaymentIntentCreateParams]
>();

jest.mock('stripe', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    paymentIntents: { create: paymentIntentsCreateMock },
  })),
}));

describe('PaymentsService', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...OLD_ENV };
    delete process.env.STRIPE_SECRET_KEY;
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('PaymentsModule exists (coverage for module file)', () => {
    expect(PaymentsModule).toBeDefined();
  });

  it('throws ServiceUnavailableException when STRIPE_SECRET_KEY is missing', async () => {
    const service = new PaymentsService();

    await expect(
      service.createPaymentIntent({ amountEur: 10 }),
    ).rejects.toBeInstanceOf(ServiceUnavailableException);

    const StripeMock = Stripe as unknown as jest.Mock;
    expect(StripeMock).not.toHaveBeenCalled();
  });

  it('creates payment intent and converts EUR -> cents', async () => {
    process.env.STRIPE_SECRET_KEY = 'sk_test_123';

    paymentIntentsCreateMock.mockResolvedValue({
      id: 'pi_123',
      client_secret: 'cs_123',
    });

    const service = new PaymentsService();

    const intent = await service.createPaymentIntent({
      amountEur: 12.345,
      metadata: { orderId: '7' },
    });

    const StripeMock = Stripe as unknown as jest.Mock;
    expect(StripeMock).toHaveBeenCalledWith('sk_test_123');

    expect(paymentIntentsCreateMock).toHaveBeenCalledWith({
      amount: Math.round(12.345 * 100),
      currency: 'eur',
      automatic_payment_methods: { enabled: true },
      metadata: { orderId: '7' },
    });

    expect(intent).toEqual({ id: 'pi_123', client_secret: 'cs_123' });
  });
});
