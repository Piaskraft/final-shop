import { Injectable } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { WeatherService } from './weather.service';

@Injectable()
export class ExternalService {
  constructor(
    private readonly currency: CurrencyService,
    private readonly weather: WeatherService,
  ) {}

  getExchangeRate(base: string, target: string) {
    return this.currency.getRate(base, target);
  }

  getWeather(city: string) {
    return this.weather.getCurrent(city);
  }

  getWeatherByCoords(lat: number, lon: number) {
    return this.weather.getCurrentByCoords(lat, lon);
  }
}
