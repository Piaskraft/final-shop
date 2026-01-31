import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ProductsService', () => {
  let service: ProductsService;

  const findUniqueMock = jest.fn();
  const findManyMock = jest.fn();
  const createMock = jest.fn();
  const updateMock = jest.fn();
  const deleteMock = jest.fn();

  const prismaMock = {
    product: {
      findUnique: findUniqueMock,
      findMany: findManyMock,
      create: createMock,
      update: updateMock,
      delete: deleteMock,
    },
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

  it('findAll(): returns list', async () => {
    findManyMock.mockResolvedValue([{ id: 1 }, { id: 2 }]);

    const result = await service.findAll();
    expect(result).toHaveLength(2);

    expect(findManyMock).toHaveBeenCalledWith({
      include: { images: true },
      orderBy: { id: 'desc' },
    });
  });

  it('getById(): throws NotFoundException when product not found', async () => {
    findUniqueMock.mockResolvedValue(null);

    await expect(service.getById(999)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('getById(): returns product when found', async () => {
    findUniqueMock.mockResolvedValue({ id: 1, slug: 'a', images: [] });

    const result = await service.getById(1);

    expect(result).toMatchObject({ id: 1 });
    expect(findUniqueMock).toHaveBeenCalledWith({
      where: { id: 1 },
      include: { images: true },
    });
  });

  it('findOneBySlug(): throws NotFoundException when not found', async () => {
    findUniqueMock.mockResolvedValue(null);

    await expect(service.findOneBySlug('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('findOneBySlug(): returns product when found', async () => {
    findUniqueMock.mockResolvedValue({
      id: 1,
      slug: 'test',
      images: [],
    });

    const result = await service.findOneBySlug('test');

    expect(result).toMatchObject({ slug: 'test' });
    expect(findUniqueMock).toHaveBeenCalledWith({
      where: { slug: 'test' },
      include: { images: true },
    });
  });

  it('create(): maps dto and uses description fallback', async () => {
    createMock.mockResolvedValue({ id: 1 });

    await service.create({
      name: 'A',
      slug: 'a',
      price: 10,
      description: null,
      mainImage: 'img',
    } as any);

    expect(createMock).toHaveBeenCalledWith({
      data: {
        name: 'A',
        slug: 'a',
        price: 10,
        description: '',
        mainImage: 'img',
      },
      include: { images: true },
    });
  });

  it('update(): sends only provided fields', async () => {
    updateMock.mockResolvedValue({ id: 1 });

    await service.update(1, { name: 'B' } as any);

    expect(updateMock).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { name: 'B' },
      include: { images: true },
    });
  });

  it('remove(): deletes by id', async () => {
    deleteMock.mockResolvedValue({ id: 1 });

    await service.remove(1);

    expect(deleteMock).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });
});
