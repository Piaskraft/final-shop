import { Controller, Get, Query } from '@nestjs/common';
import { ExternalService } from './external.service';

@Controller('external')
export class ExternalController {
  constructor(private readonly external: ExternalService) {}

  // front woła /api/external/rate?base=EUR&target=PLN
  @Get('rate')
  getRate(
    @Query('base') base = 'EUR',
    @Query('target') target = 'PLN',
  ) {
    return this.external.getExchangeRate(base, target);
  }

  // alias (jakbyś kiedyś wołał /rates)
  @Get('rates')
  getRates(
    @Query('base') base = 'EUR',
    @Query('target') target = 'PLN',
  ) {
    return this.external.getExchangeRate(base, target);
  }

  // front woła /api/external/weather?lat=...&lon=...
  @Get('weather')
  getWeather(
    @Query('city') city = 'Essen',
    @Query('lat') lat?: string,
    @Query('lon') lon?: string,
  ) {
    if (lat && lon) {
      return this.external.getWeatherByCoords(Number(lat), Number(lon));
    }
    return this.external.getWeather(city);
  }
}
