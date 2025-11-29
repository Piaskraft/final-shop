// backend/src/orders/dto/create-order.dto.ts

export class CreateOrderItemDto {
  productId: number;
  quantity: number;
  unitPrice: number;
  itemNote?: string | null;
}

export class CreateOrderDto {
  customerName: string;
  email: string;
  phone?: string | null;
  street: string;
  postalCode: string;
  city: string;
  notes?: string | null;

  items: CreateOrderItemDto[];
}
