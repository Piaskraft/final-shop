import { Test } from '@nestjs/testing';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { OrdersService } from '../orders/orders.service';

describe('PaymentsController', () => {
  let controller: PaymentsController;

  const paymentsServiceMock = {
    createPaymentIntent: jest.fn(),
  };

  const ordersServiceMock = {
    getById: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [
        { provide: PaymentsService, useValue: paymentsServiceMock },
        { provide: OrdersService, useValue: ordersServiceMock },
      ],
    }).compile();

    controller = moduleRef.get(PaymentsController);
  });

  it('create(): uses order.totalAmount and returns id+clientSecret', async () => {
    ordersServiceMock.getById.mockResolvedValue({ id: 7, totalAmount: 99.5 });
    paymentsServiceMock.createPaymentIntent.mockResolvedValue({
      id: 'pi_1',
      client_secret: 'cs_1',
    });

    const result = await controller.create({ orderId: 7 });

    expect(ordersServiceMock.getById).toHaveBeenCalledWith(7);
    expect(paymentsServiceMock.createPaymentIntent).toHaveBeenCalledWith({
      amountEur: 99.5,
      metadata: { orderId: '7' },
    });
    expect(result).toEqual({ id: 'pi_1', clientSecret: 'cs_1' });
  });
});
