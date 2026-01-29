import { Test } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { StripePaymentStrategy } from './strategies/stripe-payment.strategy';
import { ServiceUnavailableException } from '@nestjs/common';

describe('PaymentsService', () => {
  let service: PaymentsService;

  const strategyMock = {
    createPaymentIntent: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    strategyMock.createPaymentIntent.mockResolvedValue({
      clientSecret: 'cs_test_123',
    });

    const moduleRef = await Test.createTestingModule({
      providers: [
        PaymentsService,
        { provide: StripePaymentStrategy, useValue: strategyMock },
      ],
    }).compile();

    service = moduleRef.get(PaymentsService);
  });

  it('creates payment intent and converts EUR -> cents', async () => {
    const result = await service.createPaymentIntent({
      amountEur: 12.34,
      metadata: { orderId: '1' },
    });

    expect(strategyMock.createPaymentIntent).toHaveBeenCalledWith(1234, 'eur');
    expect(result).toEqual({ clientSecret: 'cs_test_123' });
  });

  it('throws ServiceUnavailableException when strategy fails', async () => {
    strategyMock.createPaymentIntent.mockRejectedValueOnce(
      new ServiceUnavailableException('Stripe is not configured'),
    );

    await expect(service.createPaymentIntent({ amountEur: 1 })).rejects.toThrow(
      'Stripe is not configured',
    );
  });
});
