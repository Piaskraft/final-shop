import { Test } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { PrismaService } from '../prisma/prisma.service';
import { ORDERS_REPOSITORY } from './orders.repository';

describe('OrdersService', () => {
  let service: OrdersService;

  const prismaMock = {
    product: {
      findMany: jest.fn(),
    },
  } as unknown as PrismaService;

  const ordersRepoMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findByIdWithItems: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
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

  it('create(): throws BadRequestException when items is empty', async () => {
    await expect(
      service.create({
        name: 'Aga',
        email: 'a@a.com',
        phone: '123',
        street: 'Test',
        postalCode: '00-000',
        city: 'City',
        notes: '',
        items: [],
      } as any),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('getById(): throws NotFoundException when order does not exist', async () => {
    ordersRepoMock.findByIdWithItems.mockResolvedValue(null);

    await expect(service.getById(999)).rejects.toBeInstanceOf(NotFoundException);
  });
});
