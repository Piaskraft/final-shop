/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Test } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { PrismaService } from '../prisma/prisma.service';
import { ORDERS_REPOSITORY } from './orders.repository';

import type { CreateOrderDto } from './dto/create-order.dto';
import type { UpdateOrderDto } from './dto/update-order.dto';

describe('OrdersService', () => {
  let service: OrdersService;

  // ---------- Prisma mock (bez any) ----------
  const findManyMock = jest.fn<
    Promise<Array<{ id: number; price: unknown }>>,
    [Record<string, unknown>]
  >();

  const prismaMock = {
    product: {
      findMany: findManyMock,
    },
  } as unknown as PrismaService;

  // ---------- OrdersRepository mock (bez any) ----------
  const createMock = jest.fn<Promise<unknown>, [Record<string, unknown>]>();
  const findAllMock = jest.fn<Promise<unknown>, []>();
  const findByIdMock = jest.fn<Promise<unknown>, [number]>();
  const findByIdWithItemsMock = jest.fn<Promise<unknown>, [number]>();
  const updateMock = jest.fn<
    Promise<unknown>,
    [number, Record<string, unknown>]
  >();
  const deleteMock = jest.fn<Promise<unknown>, [number]>();

  const ordersRepoMock = {
    create: createMock,
    findAll: findAllMock,
    findById: findByIdMock,
    findByIdWithItems: findByIdWithItemsMock,
    update: updateMock,
    delete: deleteMock,
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: ORDERS_REPOSITORY, useValue: ordersRepoMock },
      ],
    }).compile();

    service = moduleRef.get(OrdersService);
  });

  describe('create()', () => {
    it('throws BadRequestException when items is empty', async () => {
      const dto: CreateOrderDto = {
        name: 'Aga',
        email: 'a@a.com',
        phone: '123',
        street: 'Test',
        postalCode: '00-000',
        city: 'City',
        notes: '',
        items: [],
      };

      await expect(service.create(dto)).rejects.toBeInstanceOf(
        BadRequestException,
      );
      expect(findManyMock).not.toHaveBeenCalled();
      expect(createMock).not.toHaveBeenCalled();
    });

    it('throws NotFoundException when product does not exist', async () => {
      const dto: CreateOrderDto = {
        name: 'Aga',
        email: 'a@a.com',
        phone: '123',
        street: 'Test',
        postalCode: '00-000',
        city: 'City',
        notes: '',
        items: [{ productId: 999, quantity: 1 }],
      };

      findManyMock.mockResolvedValue([]); // brak produktu

      await expect(service.create(dto)).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(createMock).not.toHaveBeenCalled();
    });

    it('throws BadRequestException when quantity is invalid', async () => {
      const dto: CreateOrderDto = {
        name: 'Aga',
        email: 'a@a.com',
        phone: '123',
        street: 'Test',
        postalCode: '00-000',
        city: 'City',
        notes: '',
        items: [{ productId: 1, quantity: 0 }], // invalid
      };

      findManyMock.mockResolvedValue([{ id: 1, price: 10 }]);

      await expect(service.create(dto)).rejects.toBeInstanceOf(
        BadRequestException,
      );
      expect(createMock).not.toHaveBeenCalled();
    });

    it('creates order, calculates totalAmount and maps items', async () => {
      const dto: CreateOrderDto = {
        name: 'Aga',
        email: 'a@a.com',
        phone: '123',
        street: 'Test',
        postalCode: '00-000',
        city: 'City',
        notes: 'note',
        items: [
          { productId: 1, quantity: 2, notes: 'i1' },
          { productId: 2, quantity: 1 },
        ],
      };

      // ceny z DB
      findManyMock.mockResolvedValue([
        { id: 1, price: '10' },
        { id: 2, price: 5 },
      ]);

      const created = { id: 100, ok: true };
      createMock.mockResolvedValue(created);

      await expect(service.create(dto)).resolves.toEqual(created);

      expect(findManyMock).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: { in: expect.arrayContaining([1, 2]) } },
          select: { id: true, price: true },
        }),
      );

      // total = 2*10 + 1*5 = 25
      expect(createMock).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            customerName: 'Aga',
            notes: 'note',
            totalAmount: 25,
            items: {
              create: [
                {
                  quantity: 2,
                  unitPrice: 10,
                  itemNote: 'i1',
                  product: { connect: { id: 1 } },
                },
                {
                  quantity: 1,
                  unitPrice: 5,
                  itemNote: '',
                  product: { connect: { id: 2 } },
                },
              ],
            },
          }),
          include: {
            items: { include: { product: true } },
          },
        }),
      );
    });
  });

  describe('findAll()', () => {
    it('returns repo.findAll()', async () => {
      const list: Array<{ id: number }> = [{ id: 1 }];

      findAllMock.mockResolvedValue(list);

      await expect(service.findAll()).resolves.toEqual(list);
      expect(findAllMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('getById()', () => {
    it('throws NotFoundException when order does not exist', async () => {
      findByIdWithItemsMock.mockResolvedValue(null as unknown);

      await expect(service.getById(999)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('returns order when exists', async () => {
      const order = { id: 1, items: [] as unknown[] };

      findByIdWithItemsMock.mockResolvedValue(order);

      await expect(service.getById(1)).resolves.toEqual(order);
    });
  });

  describe('update()', () => {
    it('throws NotFoundException when order does not exist', async () => {
      findByIdMock.mockResolvedValue(null as unknown);

      const dto: UpdateOrderDto = { name: 'New' };
      await expect(service.update(123, dto)).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(updateMock).not.toHaveBeenCalled();
    });

    it('updates only base fields when dto.items is undefined', async () => {
      findByIdMock.mockResolvedValue({ id: 123 });

      const updated = { id: 123, customerName: 'New' };
      updateMock.mockResolvedValue(updated);

      const dto: UpdateOrderDto = { name: 'New' }; // items undefined

      await expect(service.update(123, dto)).resolves.toEqual(updated);

      expect(findManyMock).not.toHaveBeenCalled();
      expect(updateMock).toHaveBeenCalledWith(
        123,
        expect.objectContaining({
          where: { id: 123 },
          data: expect.objectContaining({ customerName: 'New' }),
          include: { items: { include: { product: true } } },
        }),
      );
    });

    it('throws BadRequestException when dto.items is empty array', async () => {
      findByIdMock.mockResolvedValue({ id: 123 });

      const dto: UpdateOrderDto = { items: [] };

      await expect(service.update(123, dto)).rejects.toBeInstanceOf(
        BadRequestException,
      );

      expect(findManyMock).not.toHaveBeenCalled();
      expect(updateMock).not.toHaveBeenCalled();
    });

    it('recalculates total and replaces items when dto.items is provided', async () => {
      findByIdMock.mockResolvedValue({ id: 123 });

      findManyMock.mockResolvedValue([
        { id: 1, price: 10 },
        { id: 2, price: 5 },
      ]);

      const updated = { id: 123, totalAmount: 25 };
      updateMock.mockResolvedValue(updated);

      const dto: UpdateOrderDto = {
        items: [
          { productId: 1, quantity: 2, notes: 'i1' },
          { productId: 2, quantity: 1 },
        ],
      };

      await expect(service.update(123, dto)).resolves.toEqual(updated);

      expect(updateMock).toHaveBeenCalledWith(
        123,
        expect.objectContaining({
          where: { id: 123 },
          data: expect.objectContaining({
            totalAmount: 25,
            items: {
              deleteMany: {},
              create: [
                {
                  quantity: 2,
                  unitPrice: 10,
                  itemNote: 'i1',
                  product: { connect: { id: 1 } },
                },
                {
                  quantity: 1,
                  unitPrice: 5,
                  itemNote: '',
                  product: { connect: { id: 2 } },
                },
              ],
            },
          }),
          include: { items: { include: { product: true } } },
        }),
      );
    });

    it('throws NotFoundException when dto.items contains missing product', async () => {
      findByIdMock.mockResolvedValue({ id: 123 });

      findManyMock.mockResolvedValue([{ id: 1, price: 10 }]); // brak 999

      const dto: UpdateOrderDto = {
        items: [
          { productId: 1, quantity: 1 },
          { productId: 999, quantity: 1 },
        ],
      };

      await expect(service.update(123, dto)).rejects.toBeInstanceOf(
        NotFoundException,
      );

      expect(updateMock).not.toHaveBeenCalled();
    });
  });

  describe('remove()', () => {
    it('throws NotFoundException when order does not exist', async () => {
      findByIdMock.mockResolvedValue(null);

      await expect(service.remove(123)).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(deleteMock).not.toHaveBeenCalled();
    });

    it('deletes when order exists', async () => {
      findByIdMock.mockResolvedValue({ id: 123 });

      const deleted = { id: 123 };
      deleteMock.mockResolvedValue(deleted);

      await expect(service.remove(123)).resolves.toEqual(deleted);
      expect(deleteMock).toHaveBeenCalledWith(123);
    });
  });
});
