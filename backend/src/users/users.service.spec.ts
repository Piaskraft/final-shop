import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UsersService', () => {
  let service: UsersService;

  const findManyMock = jest.fn();
  const findUniqueMock = jest.fn();

  const prismaMock = {
    user: {
      findMany: findManyMock,
      findUnique: findUniqueMock,
    },
  } as unknown as PrismaService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = moduleRef.get(UsersService);
  });

  it('findAll(): returns list', async () => {
    findManyMock.mockResolvedValue([{ id: 1 }, { id: 2 }]);

    const result = await service.findAll();
    expect(result).toHaveLength(2);
    expect(findManyMock).toHaveBeenCalledTimes(1);
  });

  it('getById(): throws NotFoundException when user not found', async () => {
    findUniqueMock.mockResolvedValue(null);

    await expect(service.getById(999)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
