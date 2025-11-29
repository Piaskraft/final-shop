// backend/src/orders/orders.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    const totalAmount = createOrderDto.items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    );

    const order = await this.prisma.order.create({
      data: {
        customerName: createOrderDto.customerName,
        email: createOrderDto.email,
        phone: createOrderDto.phone ?? null,
        street: createOrderDto.street,
        city: createOrderDto.city,
        postalCode: createOrderDto.postalCode,
        notes: createOrderDto.notes ?? null,
        totalAmount,
        items: {
          create: createOrderDto.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            itemNote: item.itemNote ?? null,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return order;
  }
}
