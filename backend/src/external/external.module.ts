import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';

import { ExternalController } from './external.controller';
import { ExternalService } from './external.service';
import { ExternalJobs } from './external.jobs';
import { CurrencyService } from './currency.service';
import { WeatherService } from './weather.service';

@Module({
  imports: [
    HttpModule,
    CacheModule.register({ ttl: 600 }), // 10 min
  ],
  controllers: [ExternalController],
  providers: [ExternalService, ExternalJobs, CurrencyService, WeatherService],
})
export class ExternalModule {}
