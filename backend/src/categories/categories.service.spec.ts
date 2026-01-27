import { Test } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

describe('CategoriesService', () => {
  let service: CategoriesService;

  // <- KLUCZ: trzymamy mocki w osobnym obiekcie typu jest.Mock
  const categoryMock = {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const prismaMock = {
    category: categoryMock,
  } as unknown as PrismaService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      providers: [
        CategoriesService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = moduleRef.get(CategoriesService);
  });

  it('findAll(): calls prisma.category.findMany with include products and orderBy desc', async () => {
    categoryMock.findMany.mockResolvedValue([{ id: 1 }]);

    const result = await service.findAll();

    expect(result).toEqual([{ id: 1 }]);
    expect(categoryMock.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: 'desc' },
      include: { products: true },
    });
  });

  it('getById(): calls prisma.category.findUnique by id', async () => {
    categoryMock.findUnique.mockResolvedValue({ id: 123 });

    const result = await service.getById(123);

    expect(result).toEqual({ id: 123 });
    expect(categoryMock.findUnique).toHaveBeenCalledWith({
      where: { id: 123 },
      include: { products: true },
    });
  });

  it('getBySlug(): calls prisma.category.findUnique by slug', async () => {
    categoryMock.findUnique.mockResolvedValue({ id: 1, slug: 'tools' });

    const result = await service.getBySlug('tools');

    expect(result).toEqual({ id: 1, slug: 'tools' });
    expect(categoryMock.findUnique).toHaveBeenCalledWith({
      where: { slug: 'tools' },
      include: { products: true },
    });
  });

  it('create(): calls prisma.category.create with dto', async () => {
    categoryMock.create.mockResolvedValue({ id: 1 });

    const dto = { name: 'Tools', slug: 'tools' } as CreateCategoryDto;

    const result = await service.create(dto);

    expect(result).toEqual({ id: 1 });
    expect(categoryMock.create).toHaveBeenCalledWith({ data: dto });
  });

  it('update(): calls prisma.category.update with id and dto', async () => {
    categoryMock.update.mockResolvedValue({ id: 1 });

    const dto = { name: 'New name' } as UpdateCategoryDto;

    const result = await service.update(1, dto);

    expect(result).toEqual({ id: 1 });
    expect(categoryMock.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: dto,
    });
  });

  it('delete(): calls prisma.category.delete with id', async () => {
    categoryMock.delete.mockResolvedValue({ id: 1 });

    const result = await service.delete(1);

    expect(result).toEqual({ id: 1 });
    expect(categoryMock.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });
});
