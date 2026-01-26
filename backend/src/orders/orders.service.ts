import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateOrderDto) {
    const { name, email, phone, street, postalCode, city, notes, items } = data;

    // bezpieczna nazwa klienta
    const anyData = data as any;
    const customerName: string =
      name ?? anyData.customerName ?? anyData.fullName ?? 'Unbekannter Kunde';

    const productIds = items.map((i) => i.productId);

    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, price: true },
    });

    const priceById = new Map<number, number>();
    products.forEach((p) => {
      const price =
        typeof p.price === 'number'
          ? p.price
          : (p.price as any)?.toNumber
          ? (p.price as any).toNumber()
          : Number(p.price);
      priceById.set(p.id, price);
    });

    const orderItemsData = items.map((item) => {
      const unitPrice = priceById.get(item.productId);
      if (unitPrice === undefined) {
        throw new Error(`Produkt o id=${item.productId} nie istnieje`);
      }

      return {
        quantity: item.quantity,
        unitPrice,
        itemNote: item.notes ?? '',
        product: { connect: { id: item.productId } },
      };
    });

    const totalAmount = orderItemsData.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    );

    return this.prisma.order.create({
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
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  findAll() {
    return this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: { product: true },
        },
      },
    });
  }

  getById(id: number) {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: { product: true },
        },
      },
    });
  }

  async update(id: number, dto: UpdateOrderDto) {
    // bierzemy dane bazowe, bo totalAmount zależy od items
    const existing = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!existing) return null;

    const anyDto = dto as any;
    const customerName =
      dto.name ?? anyDto.customerName ?? anyDto.fullName ?? undefined;

    // jeśli items nie przyszły -> aktualizujemy tylko pola w Order
    if (!dto.items) {
      return this.prisma.order.update({
        where: { id },
        data: {
          ...(customerName !== undefined ? { customerName } : {}),
          ...(dto.email !== undefined ? { email: dto.email } : {}),
          ...(dto.phone !== undefined ? { phone: dto.phone } : {}),
          ...(dto.street !== undefined ? { street: dto.street } : {}),
          ...(dto.postalCode !== undefined ? { postalCode: dto.postalCode } : {}),
          ...(dto.city !== undefined ? { city: dto.city } : {}),
          ...(dto.notes !== undefined ? { notes: dto.notes ?? '' } : {}),
        },
        include: {
          items: { include: { product: true } },
        },
      });
    }

    // jeśli items przyszły -> przeliczamy total i podmieniamy itemy (deleteMany + create)
    const productIds = dto.items.map((i) => i.productId);

    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, price: true },
    });

    const priceById = new Map<number, number>();
    products.forEach((p) => {
      const price =
        typeof p.price === 'number'
          ? p.price
          : (p.price as any)?.toNumber
          ? (p.price as any).toNumber()
          : Number(p.price);
      priceById.set(p.id, price);
    });

    const orderItemsData = dto.items.map((item) => {
      const unitPrice = priceById.get(item.productId);
      if (unitPrice === undefined) {
        throw new Error(`Produkt o id=${item.productId} nie istnieje`);
      }

      return {
        quantity: item.quantity,
        unitPrice,
        itemNote: item.notes ?? '',
        product: { connect: { id: item.productId } },
      };
    });

    const totalAmount = orderItemsData.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    );

    return this.prisma.order.update({
      where: { id },
      data: {
        ...(customerName !== undefined ? { customerName } : {}),
        ...(dto.email !== undefined ? { email: dto.email } : {}),
        ...(dto.phone !== undefined ? { phone: dto.phone } : {}),
        ...(dto.street !== undefined ? { street: dto.street } : {}),
        ...(dto.postalCode !== undefined ? { postalCode: dto.postalCode } : {}),
        ...(dto.city !== undefined ? { city: dto.city } : {}),
        ...(dto.notes !== undefined ? { notes: dto.notes ?? '' } : {}),
        totalAmount,
        items: {
          deleteMany: {},
          create: orderItemsData,
        },
      },
      include: {
        items: { include: { product: true } },
      },
    });
  }

  remove(id: number) {
    return this.prisma.order.delete({
      where: { id },
    });
  }
}
