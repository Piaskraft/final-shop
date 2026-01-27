import { Test } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

describe('CategoriesController', () => {
  let controller: CategoriesController;

  const serviceMock = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [{ provide: CategoriesService, useValue: serviceMock }],
    }).compile();

    controller = moduleRef.get(CategoriesController);
  });

  it('findAll(): returns categories from service', async () => {
    serviceMock.findAll.mockResolvedValue([{ id: 1 }]);

    const result = await controller.findAll();

    expect(result).toEqual([{ id: 1 }]);
    expect(serviceMock.findAll).toHaveBeenCalledTimes(1);
  });
});
