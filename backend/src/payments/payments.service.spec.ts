import { ServiceUnavailableException } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { StripePaymentStrategy } from './strategies/stripe-payment.strategy';

describe('PaymentsService', () => {
  it('creates payment intent and converts EUR -> cents', async () => {
    const strategyMock: Pick<StripePaymentStrategy, 'createPaymentIntent'> = {
      createPaymentIntent: jest
        .fn()
        .mockResolvedValue({ clientSecret: 'cs_test_123' }),
    };

    const service = new PaymentsService(strategyMock as StripePaymentStrategy);

    const result = await service.createPaymentIntent({
      amountEur: 12.34,
      metadata: { orderId: '1' },
    });

    expect(strategyMock.createPaymentIntent).toHaveBeenCalledWith(1234, 'eur');
    expect(result).toEqual({ clientSecret: 'cs_test_123' });
  });

  it('throws ServiceUnavailableException when strategy fails', async () => {
    const strategyMock: Pick<StripePaymentStrategy, 'createPaymentIntent'> = {
      createPaymentIntent: jest.fn().mockRejectedValue(new Error('fail')),
    };

    const service = new PaymentsService(strategyMock as StripePaymentStrategy);

    await expect(
      service.createPaymentIntent({ amountEur: 1 }),
    ).rejects.toBeInstanceOf(ServiceUnavailableException);
  });
});
