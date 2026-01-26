import { Prisma } from '@prisma/client';

export const ORDERS_REPOSITORY = Symbol('ORDERS_REPOSITORY');

export type OrderEntity = Record<string, unknown>;
export type OrderListEntity = OrderEntity[];

export interface OrdersRepository {
  create(args: Prisma.OrderCreateArgs): Promise<OrderEntity>;
  findAll(): Promise<OrderListEntity>;
  findById(id: number): Promise<OrderEntity | null>;
  findByIdWithItems(id: number): Promise<OrderEntity | null>;
  update(id: number, args: Prisma.OrderUpdateArgs): Promise<OrderEntity>;
  delete(id: number): Promise<OrderEntity>;
}
