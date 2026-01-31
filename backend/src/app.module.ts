import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CacheModule } from '@nestjs/cache-manager';
import { ScheduleModule } from '@nestjs/schedule';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { CategoriesModule } from './categories/categories.module';
import { UsersModule } from './users/users.module';
import { PaymentsModule } from './payments/payments.module';
import { MailModule } from './mail/mail.module';
import { JobsModule } from './jobs/jobs.module';
import { ExternalModule } from './external/external.module';

@Module({
  imports: [
    // React build served by Nest (backend/public)
    ServeStaticModule.forRoot({
     rootPath: join(__dirname, '..', 'public'),

      exclude: ['/api*'],
    }),

    // Global cache
    CacheModule.register({
      isGlobal: true,
      ttl: 60, // seconds
    }),

    // Scheduler
    ScheduleModule.forRoot(),

    // App modules
    ExternalModule,
    PrismaModule,
    ProductsModule,
    OrdersModule,
    CategoriesModule,
    UsersModule,
    PaymentsModule,
    MailModule,
    JobsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
