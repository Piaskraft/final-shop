import { StripePaymentStrategy } from './stripe-payment.strategy';
import Stripe from 'stripe';

jest.mock('stripe', () => {
  const createMock = jest
    .fn()
    .mockResolvedValue({ client_secret: 'cs_test_123' });

  const StripeMock = jest.fn().mockImplementation(() => ({
    paymentIntents: {
      create: createMock,
    },
  }));

  return { __esModule: true, default: StripeMock };
});

describe('StripePaymentStrategy', () => {
  beforeEach(() => {
    process.env.STRIPE_SECRET_KEY = 'sk_test_dummy';
    jest.clearAllMocks();
  });

  it('should create payment intent and return clientSecret', async () => {
    const strategy = new StripePaymentStrategy();

    const result = await strategy.createPaymentIntent(1000, 'eur');

    expect(result).toEqual({ clientSecret: 'cs_test_123' });

    const StripeCtor = Stripe as unknown as jest.Mock;

    const stripeInstance = StripeCtor.mock.results[0].value as unknown as {
      paymentIntents: { create: jest.Mock };
    };

    expect(stripeInstance.paymentIntents.create).toHaveBeenCalledWith({
      amount: 1000,
      currency: 'eur',
      automatic_payment_methods: { enabled: true },
    });
  });
});
