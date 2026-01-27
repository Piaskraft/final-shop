import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { PrismaService } from '../prisma/prisma.service';

type PrismaProductMock = {
  findUnique: jest.Mock;
  findMany: jest.Mock;
};

describe('ProductsService', () => {
  let service: ProductsService;

  const productMock: PrismaProductMock = {
    findUnique: jest.fn(),
    findMany: jest.fn(),
  };

  const prismaMock = {
    product: productMock,
  } as unknown as PrismaService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = moduleRef.get(ProductsService);
  });

  it('getById(): throws NotFoundException when product not found', async () => {
    productMock.findUnique.mockResolvedValue(null);

    await expect(service.getById(999)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('findAll(): returns list', async () => {
    productMock.findMany.mockResolvedValue([{ id: 1 }, { id: 2 }]);

    const result = await service.findAll();
    expect(result).toHaveLength(2);
  });
});

