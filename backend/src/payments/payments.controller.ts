import { Body, Controller, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { OrdersService } from '../orders/orders.service';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { toNumber } from '../common/utils/toNumber';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly ordersService: OrdersService,
  ) {}

  @Post('payment-intent')
  async create(@Body() dto: CreatePaymentIntentDto) {
    const order = await this.ordersService.getById(dto.orderId);

    const { clientSecret } = await this.paymentsService.createPaymentIntent({
      amountEur: toNumber(order.totalAmount),
      metadata: { orderId: String(order.id) },
    });

    return {
      orderId: order.id,
      clientSecret,
    };
  }
}
