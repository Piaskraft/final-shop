import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { ExternalController } from './external.controller';
import { ExternalService } from './external.service';
import { CurrencyService } from './currency.service';
import { WeatherService } from './weather.service';

@Module({
  imports: [HttpModule],
  controllers: [ExternalController],
  providers: [ExternalService, CurrencyService, WeatherService],
})
export class ExternalModule {}
