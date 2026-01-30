import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

import { CurrencyService, type ExchangeRateDto } from './currency.service';
import { WeatherService, type WeatherDto } from './weather.service';

const TTL_SECONDS = 600; // 10 min

type CachedResult<T> = { data: T; cacheHit: boolean };

@Injectable()
export class ExternalService {
  constructor(
    private readonly currency: CurrencyService,
    private readonly weather: WeatherService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  private rateKey(base: string, target: string) {
    return `rate:${base.toUpperCase()}:${target.toUpperCase()}`;
  }

  private weatherKey(lat: number, lon: number) {
    // zaokrąglamy żeby cache nie miał miliona kluczy przez drobne różnice
    return `weather:${lat.toFixed(4)}:${lon.toFixed(4)}`;
  }

  async getExchangeRate(base = 'EUR', target = 'PLN'): Promise<CachedResult<ExchangeRateDto>> {
    const key = this.rateKey(base, target);

    const cached = await this.cache.get<ExchangeRateDto>(key);
    if (cached) return { data: cached, cacheHit: true };

    const fresh = await this.currency.getRate(base, target);
    await this.cache.set(key, fresh, TTL_SECONDS);

    return { data: fresh, cacheHit: false };
  }

  async getWeather(lat: number, lon: number, city: string | null = null): Promise<CachedResult<WeatherDto>> {
    const key = this.weatherKey(lat, lon);

    const cached = await this.cache.get<WeatherDto>(key);
    if (cached) return { data: cached, cacheHit: true };

    const fresh = await this.weather.getCurrentByCoords(lat, lon, city);
    await this.cache.set(key, fresh, TTL_SECONDS);

    return { data: fresh, cacheHit: false };
  }
}
