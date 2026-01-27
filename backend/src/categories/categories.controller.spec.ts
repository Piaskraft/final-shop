import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

describe('CategoriesController', () => {
  let controller: CategoriesController;

  const serviceMock = {
    findAll: jest.fn(),
    getById: jest.fn(),
    getBySlug: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
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

  it('getById(): returns category when found', async () => {
    serviceMock.getById.mockResolvedValue({ id: 123 });

    const result = await controller.getById(123);
    expect(result).toEqual({ id: 123 });
    expect(serviceMock.getById).toHaveBeenCalledWith(123);
  });

  it('getById(): throws NotFoundException when missing', async () => {
    serviceMock.getById.mockResolvedValue(null);

    await expect(controller.getById(999)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(serviceMock.getById).toHaveBeenCalledWith(999);
  });

  it('getBySlug(): returns category when found', async () => {
    serviceMock.getBySlug.mockResolvedValue({ id: 2, slug: 'abc' });

    const result = await controller.getBySlug('abc');
    expect(result).toEqual({ id: 2, slug: 'abc' });
    expect(serviceMock.getBySlug).toHaveBeenCalledWith('abc');
  });

  it('getBySlug(): throws NotFoundException when missing', async () => {
    serviceMock.getBySlug.mockResolvedValue(null);

    await expect(controller.getBySlug('nope')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('create(): passes dto to service', async () => {
    const dto: CreateCategoryDto = { name: 'Cat', slug: 'cat' };
    serviceMock.create.mockResolvedValue({ id: 1, ...dto });

    const result = await controller.create(dto);
    expect(result).toEqual({ id: 1, ...dto });
    expect(serviceMock.create).toHaveBeenCalledWith(dto);
  });

  it('update(): throws NotFoundException when category does not exist', async () => {
    serviceMock.getById.mockResolvedValue(null);

    const dto: UpdateCategoryDto = { name: 'New' };

    await expect(controller.update(123, dto)).rejects.toBeInstanceOf(
      NotFoundException,
    );

    expect(serviceMock.getById).toHaveBeenCalledWith(123);
    expect(serviceMock.update).not.toHaveBeenCalled();
  });

  it('update(): calls service.update when category exists', async () => {
    serviceMock.getById.mockResolvedValue({ id: 123 });

    const dto: UpdateCategoryDto = { name: 'New' };
    serviceMock.update.mockResolvedValue({ id: 123, name: 'New' });

    const result = await controller.update(123, dto);
    expect(result).toEqual({ id: 123, name: 'New' });

    expect(serviceMock.getById).toHaveBeenCalledWith(123);
    expect(serviceMock.update).toHaveBeenCalledWith(123, dto);
  });

  it('delete(): throws NotFoundException when category does not exist', async () => {
    serviceMock.getById.mockResolvedValue(null);

    await expect(controller.delete(123)).rejects.toBeInstanceOf(
      NotFoundException,
    );

    expect(serviceMock.getById).toHaveBeenCalledWith(123);
    expect(serviceMock.delete).not.toHaveBeenCalled();
  });

  it('delete(): calls service.delete when category exists', async () => {
    serviceMock.getById.mockResolvedValue({ id: 123 });
    serviceMock.delete.mockResolvedValue({ id: 123 });

    const result = await controller.delete(123);
    expect(result).toEqual({ id: 123 });

    expect(serviceMock.getById).toHaveBeenCalledWith(123);
    expect(serviceMock.delete).toHaveBeenCalledWith(123);
  });
});
