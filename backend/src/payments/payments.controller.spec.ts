import { Test } from '@nestjs/testing';
import { ServiceUnavailableException } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { OrdersService } from '../orders/orders.service';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';

describe('PaymentsController', () => {
  let controller: PaymentsController;

  const createPaymentIntent = jest.fn<
    ReturnType<PaymentsService['createPaymentIntent']>,
    Parameters<PaymentsService['createPaymentIntent']>
  >();

  const getById = jest.fn<
    ReturnType<OrdersService['getById']>,
    Parameters<OrdersService['getById']>
  >();

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [
        { provide: PaymentsService, useValue: { createPaymentIntent } },
        { provide: OrdersService, useValue: { getById } },
      ],
    }).compile();

    controller = moduleRef.get(PaymentsController);

    createPaymentIntent.mockReset();
    getById.mockReset();
  });

  it('creates payment intent from order total and adds metadata', async () => {
    getById.mockResolvedValue({ id: 1, totalAmount: '12.34' } as Awaited<
      ReturnType<OrdersService['getById']>
    >);

    createPaymentIntent.mockResolvedValue({
      clientSecret: 'cs_test_123',
    } as Awaited<ReturnType<PaymentsService['createPaymentIntent']>>);

    const dto = new CreatePaymentIntentDto();
    dto.orderId = 1;

    const result = await controller.create(dto);

    expect(getById).toHaveBeenCalledWith(1);
    expect(createPaymentIntent).toHaveBeenCalledWith({
      amountEur: 12.34,
      metadata: { orderId: '1' },
    });
    expect(result).toEqual({ clientSecret: 'cs_test_123', orderId: 1 });
  });

  it('bubbles up ServiceUnavailableException from PaymentsService', async () => {
    getById.mockResolvedValue({ id: 1, totalAmount: '12.34' } as Awaited<
      ReturnType<OrdersService['getById']>
    >);

    createPaymentIntent.mockRejectedValue(
      new ServiceUnavailableException('Stripe is not configured'),
    );

    const dto = new CreatePaymentIntentDto();
    dto.orderId = 1;

    await expect(controller.create(dto)).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    );
  });
});
