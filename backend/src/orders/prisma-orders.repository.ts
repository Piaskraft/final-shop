import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { OrdersRepository, OrderEntity } from './orders.repository';

@Injectable()
export class PrismaOrdersRepository implements OrdersRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(args: Prisma.OrderCreateArgs): Promise<OrderEntity> {
    return this.prisma.order.create(args) as unknown as Promise<OrderEntity>;
  }

  findAll(): Promise<OrderEntity[]> {
    return this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: { items: { include: { product: true } } },
    }) as unknown as Promise<OrderEntity[]>;
  }

  findById(id: number): Promise<OrderEntity | null> {
    return this.prisma.order.findUnique({
      where: { id },
    }) as unknown as Promise<OrderEntity | null>;
  }

  findByIdWithItems(id: number): Promise<OrderEntity | null> {
    return this.prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } } },
    }) as unknown as Promise<OrderEntity | null>;
  }

  update(id: number, args: Prisma.OrderUpdateArgs): Promise<OrderEntity> {
    return this.prisma.order.update(args) as unknown as Promise<OrderEntity>;
  }

  delete(id: number): Promise<OrderEntity> {
    return this.prisma.order.delete({
      where: { id },
    }) as unknown as Promise<OrderEntity>;
  }
}
