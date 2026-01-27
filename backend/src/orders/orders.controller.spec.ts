import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

describe('OrdersController', () => {
  let controller: OrdersController;

  const serviceMock: Pick<
    OrdersService,
    'create' | 'findAll' | 'getById' | 'update' | 'remove'
  > = {
    create: jest.fn(),
    findAll: jest.fn(),
    getById: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [{ provide: OrdersService, useValue: serviceMock }],
    }).compile();

    controller = moduleRef.get(OrdersController);
  });

  it('create(): returns result from service', async () => {
    const dto: CreateOrderDto = {
      name: 'Aga',
      email: 'a@a.com',
      phone: '123',
      street: 'Test',
      postalCode: '00-000',
      city: 'City',
      notes: '',
      items: [{ productId: 1, quantity: 2 }],
    };

    (serviceMock.create as jest.Mock).mockResolvedValue({ id: 1 });

    const result = await controller.create(dto);
    expect(result).toEqual({ id: 1 });
    expect(serviceMock.create).toHaveBeenCalledWith(dto);
  });

  it('findAll(): returns result from service', async () => {
    (serviceMock.findAll as jest.Mock).mockResolvedValue([{ id: 1 }]);

    const result = await controller.findAll();
    expect(result).toEqual([{ id: 1 }]);
    expect(serviceMock.findAll).toHaveBeenCalledTimes(1);
  });

  it('getById(): returns order when found and passes number id', async () => {
    (serviceMock.getById as jest.Mock).mockResolvedValue({ id: 123 });

    const result = await controller.getById('123');
    expect(result).toEqual({ id: 123 });
    expect(serviceMock.getById).toHaveBeenCalledWith(123);
  });

  it('getById(): throws NotFoundException when missing', async () => {
    (serviceMock.getById as jest.Mock).mockResolvedValue(null);

    await expect(controller.getById('999')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('update(): returns updated when found and passes number id', async () => {
    const dto: UpdateOrderDto = { notes: 'new' };
    (serviceMock.update as jest.Mock).mockResolvedValue({
      id: 123,
      notes: 'new',
    });

    const result = await controller.update('123', dto);
    expect(result).toEqual({ id: 123, notes: 'new' });
    expect(serviceMock.update).toHaveBeenCalledWith(123, dto);
  });

  it('update(): throws NotFoundException when service returns null', async () => {
    const dto: UpdateOrderDto = { notes: 'x' };
    (serviceMock.update as jest.Mock).mockResolvedValue(null);

    await expect(controller.update('123', dto)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('remove(): calls service.remove with number id', async () => {
    (serviceMock.remove as jest.Mock).mockResolvedValue({ id: 123 });

    const result = await controller.remove('123');
    expect(result).toEqual({ id: 123 });
    expect(serviceMock.remove).toHaveBeenCalledWith(123);
  });
});
