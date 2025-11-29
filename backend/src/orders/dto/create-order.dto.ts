// backend/src/orders/dto/create-order.dto.ts
export class CreateOrderDto {
  name: string;
  email: string;
  phone?: string;
  street: string;
  postalCode: string;
  city: string;
  note?: string;

  items: {
    productId: number;
    quantity: number;
    note?: string;
    // price z frontu nas nie interesuje – bierzemy go z bazy
  }[];
}
