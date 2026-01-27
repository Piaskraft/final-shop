import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
  let controller: ProductsController;

  const serviceMock = {
    findAll: jest.fn(),
    getById: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [{ provide: ProductsService, useValue: serviceMock }],
    }).compile();

    controller = moduleRef.get(ProductsController);
  });

  it('findAll(): returns products from service', async () => {
    serviceMock.findAll.mockResolvedValue([{ id: 1 }, { id: 2 }]);

    const result = await controller.findAll();
    expect(result).toHaveLength(2);
    expect(serviceMock.findAll).toHaveBeenCalledTimes(1);
  });

  it('getById(): returns one product', async () => {
    serviceMock.getById.mockResolvedValue({ id: 123 });

    const result = await controller.getById(123);
    expect(result).toEqual({ id: 123 });
    expect(serviceMock.getById).toHaveBeenCalledWith(123);
  });

  it('getById(): propagates NotFoundException', async () => {
    serviceMock.getById.mockRejectedValue(new NotFoundException('not found'));

    await expect(controller.getById(999)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
