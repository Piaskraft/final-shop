import { Test } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;

  const serviceMock = {
    findAll: jest.fn(),
    getById: jest.fn(),
  };

  beforeEach(async () => {
    serviceMock.findAll.mockReset();
    serviceMock.getById.mockReset();

    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: serviceMock }],
    }).compile();

    controller = moduleRef.get(UsersController);
  });

  it('findAll(): returns users from service', async () => {
    serviceMock.findAll.mockResolvedValue([{ id: 1 }]);

    await expect(controller.findAll()).resolves.toEqual([{ id: 1 }]);
    expect(serviceMock.findAll).toHaveBeenCalledTimes(1);
  });

  it('getById(): returns one user and passes number to service', async () => {
    serviceMock.getById.mockResolvedValue({ id: 123 });

    const result = await controller.getById('123');
    expect(result).toEqual({ id: 123 });
    expect(serviceMock.getById).toHaveBeenCalledWith(123);
  });

  it('getById(): throws BadRequestException for non-numeric id', async () => {
    await expect(controller.getById('abc')).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(serviceMock.getById).not.toHaveBeenCalled();
  });

  it('getById(): propagates NotFoundException', async () => {
    serviceMock.getById.mockRejectedValue(new NotFoundException('not found'));

    await expect(controller.getById('999')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
