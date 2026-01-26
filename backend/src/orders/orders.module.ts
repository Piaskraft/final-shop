import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaOrdersRepository } from './prisma-orders.repository';
import { ORDERS_REPOSITORY } from './orders.repository';

@Module({
  controllers: [OrdersController],
  providers: [
    OrdersService,
    PrismaService,
    PrismaOrdersRepository,
    {
      provide: ORDERS_REPOSITORY,
      useExisting: PrismaOrdersRepository,
    },
  ],
})
export class OrdersModule {}
