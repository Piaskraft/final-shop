import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

type ProductWithImages = Prisma.ProductGetPayload<{
  include: { images: true };
}>;

const makeProduct = (
  overrides: Partial<ProductWithImages> = {},
): ProductWithImages => {
  const id = overrides.id ?? 123;

  return {
    id,
    name: overrides.name ?? 'Test product',
    slug: overrides.slug ?? 'test-product',
    description: overrides.description ?? 'desc',
    price: overrides.price ?? new Prisma.Decimal(9.99),
    mainImage: overrides.mainImage ?? 'https://example.com/img.png',
    categoryId: overrides.categoryId ?? null,
    createdAt: overrides.createdAt ?? new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: overrides.updatedAt ?? new Date('2026-01-01T00:00:00.000Z'),
    images: overrides.images ?? [
      {
        id: 1,
        url: 'https://example.com/img-1.png',
        productId: id,
      },
    ],
  };
};

describe('ProductsController', () => {
  let controller: ProductsController;

  const serviceMock: Pick<
    jest.Mocked<ProductsService>,
    'findAll' | 'getById'
  > = {
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
    const p1 = makeProduct({ id: 1, slug: 'p-1' });
    const p2 = makeProduct({
      id: 2,
      slug: 'p-2',
      price: new Prisma.Decimal(1.23),
    });

    serviceMock.findAll.mockResolvedValue([p1, p2]);

    const result = await controller.findAll();
    expect(result).toHaveLength(2);
    expect(serviceMock.findAll).toHaveBeenCalledTimes(1);
  });

  it('getById(): returns one product', async () => {
    const p = makeProduct({ id: 123 });

    serviceMock.getById.mockResolvedValue(p);

    const result = await controller.getById(123);
    expect(result).toEqual(p);
    expect(serviceMock.getById).toHaveBeenCalledWith(123);
  });

  it('getById(): propagates NotFoundException', async () => {
    serviceMock.getById.mockRejectedValue(new NotFoundException('not found'));

    await expect(controller.getById(999)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
