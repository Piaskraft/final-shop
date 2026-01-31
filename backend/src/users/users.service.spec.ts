import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersService', () => {
  let service: UsersService;

  const findUniqueMock = jest.fn();
  const findManyMock = jest.fn();
  const createMock = jest.fn();
  const updateMock = jest.fn();
  const deleteMock = jest.fn();

  const prismaMock = {
    user: {
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

    expect(findManyMock).toHaveBeenCalledWith({
      orderBy: { id: 'desc' },
    });
  });

  it('getById(): throws NotFoundException when user not found', async () => {
    findUniqueMock.mockResolvedValue(null);

    await expect(service.getById(999)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('getById(): returns user when found', async () => {
    findUniqueMock.mockResolvedValue({ id: 1, email: 'a@a.com' });

    const result = await service.getById(1);

    expect(result).toMatchObject({ id: 1 });
    expect(findUniqueMock).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('create(): creates user', async () => {
    createMock.mockResolvedValue({ id: 1 });

    const dto: CreateUserDto = {
      email: 'a@a.com',
      name: 'A',
    };

    await service.create(dto);

    expect(createMock).toHaveBeenCalledWith({
      data: { email: 'a@a.com', name: 'A' },
    });
  });

  it('update(): updates user', async () => {
    updateMock.mockResolvedValue({ id: 1 });

    const dto: UpdateUserDto = { name: 'B' };

    await service.update(1, dto);

    expect(updateMock).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { name: 'B' },
    });
  });

  it('remove(): deletes user', async () => {
    deleteMock.mockResolvedValue({ id: 1 });

    await service.remove(1);

    expect(deleteMock).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });
});
