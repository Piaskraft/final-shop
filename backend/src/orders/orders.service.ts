import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { DEFAULTS } from '../config/constants';

import { toNumber } from '../common/utils/toNumber';
import { ORDERS_REPOSITORY } from './orders.repository';
import type { OrdersRepository } from './orders.repository';

@Injectable()
export class OrdersService {
  constructor(
    @Inject(ORDERS_REPOSITORY)
    private readonly ordersRepo: OrdersRepository,
    private readonly prisma: PrismaService, // jeszcze tylko do product prices (następny krok: ProductsRepository)
  ) {}

  async create(dto: CreateOrderDto) {
    const { name, email, phone, street, postalCode, city, notes, items } = dto;

    const customerName = name ?? DEFAULTS.CUSTOMER_NAME;

    if (!items || items.length === 0) {
      throw new BadRequestException(
        'Zamówienie musi zawierać co najmniej 1 produkt.',
      );
    }

    const priceById = await this.getPriceByProductId(
      items.map((i) => i.productId),
    );

    const orderItemsData = this.buildOrderItemsData(items, priceById);
    const totalAmount = this.calcTotal(orderItemsData);

    return this.ordersRepo.create({
      data: {
        customerName,
        email,
        phone,
        street,
        postalCode,
        city,
        notes: notes ?? '',
        totalAmount,
        items: { create: orderItemsData },
      },
      include: {
        items: { include: { product: true } },
      },
    });
  }

  findAll() {
    return this.ordersRepo.findAll();
  }

  async getById(id: number) {
    const order = await this.ordersRepo.findByIdWithItems(id);

    if (!order) {
      throw new NotFoundException(`Order id=${id} nie istnieje.`);
    }

    return order;
  }

  async update(id: number, dto: UpdateOrderDto) {
    const existing = await this.ordersRepo.findById(id);

    if (!existing) {
      throw new NotFoundException(`Order id=${id} nie istnieje.`);
    }

    // Bazowe pola do aktualizacji (bez items)
    const baseData: Record<string, unknown> = {
      ...(dto.name !== undefined ? { customerName: dto.name } : {}),
      ...(dto.email !== undefined ? { email: dto.email } : {}),
      ...(dto.phone !== undefined ? { phone: dto.phone } : {}),
      ...(dto.street !== undefined ? { street: dto.street } : {}),
      ...(dto.postalCode !== undefined ? { postalCode: dto.postalCode } : {}),
      ...(dto.city !== undefined ? { city: dto.city } : {}),
      ...(dto.notes !== undefined ? { notes: dto.notes ?? '' } : {}),
    };

    // Jeśli items nie przyszły -> tylko aktualizacja pól bazowych
    if (dto.items === undefined) {
      return this.ordersRepo.update(id, {
        where: { id },
        data: baseData,
        include: { items: { include: { product: true } } },
      });
    }

    // Jeśli items przyszły -> przeliczamy total i podmieniamy itemy
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('items nie może być pustą tablicą.');
    }

    const priceById = await this.getPriceByProductId(
      dto.items.map((i) => i.productId),
    );

    const orderItemsData = this.buildOrderItemsData(dto.items, priceById);
    const totalAmount = this.calcTotal(orderItemsData);

    return this.ordersRepo.update(id, {
      where: { id },
      data: {
        ...baseData,
        totalAmount,
        items: {
          deleteMany: {},
          create: orderItemsData,
        },
      },
      include: { items: { include: { product: true } } },
    });
  }

  async remove(id: number) {
    const existing = await this.ordersRepo.findById(id);

    if (!existing) {
      throw new NotFoundException(`Order id=${id} nie istnieje.`);
    }

    return this.ordersRepo.delete(id);
  }

  // ---------- PRIVATE HELPERS ----------

  private async getPriceByProductId(productIds: number[]) {
    const uniqueIds = Array.from(new Set(productIds));

    const products = await this.prisma.product.findMany({
      where: { id: { in: uniqueIds } },
      select: { id: true, price: true },
    });

    const priceById = new Map<number, number>();
    for (const p of products) {
      priceById.set(p.id, toNumber(p.price));
    }

    return priceById;
  }

  private buildOrderItemsData(
    items: Array<{ productId: number; quantity: number; notes?: string }>,
    priceById: Map<number, number>,
  ) {
    return items.map((item) => {
      const unitPrice = priceById.get(item.productId);

      if (unitPrice === undefined) {
        throw new NotFoundException(
          `Produkt id=${item.productId} nie istnieje.`,
        );
      }

      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        throw new BadRequestException(
          `quantity dla productId=${item.productId} musi być liczbą > 0.`,
        );
      }

      return {
        quantity: item.quantity,
        unitPrice,
        itemNote: item.notes ?? '',
        product: { connect: { id: item.productId } },
      };
    });
  }

  private calcTotal(
    orderItemsData: Array<{ unitPrice: number; quantity: number }>,
  ) {
    return orderItemsData.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    );
  }
}
