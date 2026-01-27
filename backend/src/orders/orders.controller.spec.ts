import { Test } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

describe('OrdersController', () => {
  let controller: OrdersController;

  const ordersServiceMock = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [{ provide: OrdersService, useValue: ordersServiceMock }],
    }).compile();

    controller = moduleRef.get(OrdersController);
  });

  it('findAll(): returns orders from service', async () => {
    ordersServiceMock.findAll.mockResolvedValue([{ id: 1 }]);

    const result = await controller.findAll();

    expect(result).toEqual([{ id: 1 }]);
    expect(ordersServiceMock.findAll).toHaveBeenCalledTimes(1);
  });
});
