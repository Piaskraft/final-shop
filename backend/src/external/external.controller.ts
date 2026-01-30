import {
  BadRequestException,
  Controller,
  Get,
  Query,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { ExternalService } from './external.service';

@Controller('external')
export class ExternalController {
  constructor(private readonly external: ExternalService) {}

  // /api/external/rate?base=EUR&target=PLN
  // + alias /rates żeby nie było 404 jak ktoś używa starego URL
  @Get(['rate', 'rates'])
  async getRate(
    @Res({ passthrough: true }) res: Response,
    @Query('base') base = 'EUR',
    @Query('target') target = 'PLN',
  ) {
    const { data, cacheHit } = await this.external.getExchangeRate(base, target);
    res.setHeader('X-Cache', cacheHit ? 'HIT' : 'MISS');
    return data;
  }

  // /api/external/weather?lat=51.4556&lon=7.0116&city=Essen
  @Get('weather')
  async getWeather(
    @Res({ passthrough: true }) res: Response,
    @Query('lat') latRaw: string,
    @Query('lon') lonRaw: string,
    @Query('city') city?: string,
  ) {
    const lat = Number(latRaw);
    const lon = Number(lonRaw);

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      throw new BadRequestException('lat/lon are required numbers');
    }

    const { data, cacheHit } = await this.external.getWeather(
      lat,
      lon,
      city ?? null,
    );

    res.setHeader('X-Cache', cacheHit ? 'HIT' : 'MISS');
    return data;
  }
}
