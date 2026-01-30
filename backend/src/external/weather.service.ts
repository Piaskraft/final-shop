import { Injectable, BadGatewayException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

export type WeatherDto = {
  provider: 'open-meteo.com';
  city: string | null;
  lat: number;
  lon: number;
  temperature: number;
  windspeed: number;
  weathercode: number;
  time: string;
};

@Injectable()
export class WeatherService {
  constructor(private readonly http: HttpService) {}

  async getCurrentByCoords(
    lat: number,
    lon: number,
    city: string | null = null,
  ): Promise<WeatherDto> {
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(lat)}` +
      `&longitude=${encodeURIComponent(lon)}` +
      `&current_weather=true&timezone=auto`;

    try {
      const { data } = await firstValueFrom(
        this.http.get(url, { timeout: 8000 }),
      );

      const cw = data?.current_weather;
      const temperature = Number(cw?.temperature);
      const windspeed = Number(cw?.windspeed);
      const weathercode = Number(cw?.weathercode);
      const time = String(cw?.time ?? '');

      if (
        !Number.isFinite(temperature) ||
        !Number.isFinite(windspeed) ||
        !Number.isFinite(weathercode) ||
        !time
      ) {
        throw new Error('Invalid response');
      }

      return {
        provider: 'open-meteo.com',
        city,
        lat,
        lon,
        temperature,
        windspeed,
        weathercode,
        time,
      };
    } catch {
      throw new BadGatewayException('External weather API error');
    }
  }
}
