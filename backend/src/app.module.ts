import { Module } from '@nestjs/common';


import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { CategoriesModule } from './categories/categories.module';
import { UsersModule } from './users/users.module';
import { ScheduleModule } from '@nestjs/schedule';
import { PaymentsModule } from './payments/payments.module';
import { MailModule } from './mail/mail.module';
import { JobsModule } from './jobs/jobs.module';

@Module({
  imports: [
    
    PrismaModule,
    ProductsModule,
    OrdersModule,
    CategoriesModule,
    UsersModule,
    ScheduleModule.forRoot(),
    PaymentsModule,
    MailModule,
    JobsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
