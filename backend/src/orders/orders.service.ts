// backend/src/orders/orders.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateOrderDto) {
    const { name, email, phone, street, postalCode, city, note, items } = data;

    // Bezpieczne wyliczenie customerName – nawet jeśli w DTO pole nazywa się inaczej
    const anyData = data as any;
    const customerName: string =
      name ??
      anyData.customerName ??
      anyData.fullName ??
      'Unbekannter Kunde';

    // 1. ID produktów z koszyka
    const productIds = items.map((item) => item.productId);

    // 2. Pobieramy produkty z bazy
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      select: {
        id: true,
        price: true,
      },
    });

    // 3. Mapa id -> cena (number)
    const priceById = new Map<number, number>();

    products.forEach((p) => {
      const price =
        typeof p.price === 'number'
          ? p.price
          : (p.price as any).toNumber
          ? (p.price as any).toNumber()
          : Number(p.price);

      priceById.set(p.id, price);
    });

    // 4. Dane pozycji zamówienia
    const orderItemsData = items.map((item) => {
      const unitPrice = priceById.get(item.productId);

      if (unitPrice === undefined) {
        throw new Error(`Produkt o id=${item.productId} nie istnieje`);
      }

      return {
        quantity: item.quantity,
        unitPrice,
        itemNote: item.note ?? '',
        product: {
          connect: { id: item.productId },
        },
      };
    });

    // 5. Suma zamówienia
    const totalAmount = orderItemsData.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    );

    // 6. Tworzymy zamówienie w Prisma
    return this.prisma.order.create({
      data: {
        customerName,        // <<< TERAZ ZAWSZE JEST STRING
        email,
        phone,
        street,
        postalCode,
        city,
        notes: note ?? '',
        totalAmount,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: true,
      },
    });
  }

  findAll() {
    return this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    });
  }
}
