import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { toNumber } from '../common/utils/toNumber';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get('id/:id')
  async getById(@Param('id') id: string) {
    const orderId = toNumber(id);
    const order = await this.ordersService.getById(orderId);
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  @Patch('id/:id')
  async update(@Param('id') id: string, @Body() dto: UpdateOrderDto) {
    const orderId = toNumber(id);
    const updated = await this.ordersService.update(orderId, dto);
    if (!updated) throw new NotFoundException('Order not found');
    return updated;
  }

  @Delete('id/:id')
  remove(@Param('id') id: string) {
    const orderId = toNumber(id);
    return this.ordersService.remove(orderId);
  }
}
