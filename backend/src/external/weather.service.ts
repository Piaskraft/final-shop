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

type OpenMeteoCurrentWeather = {
  temperature: number;
  windspeed: number;
  weathercode: number;
  time: string;
};

type OpenMeteoResponse = {
  latitude: number;
  longitude: number;
  current_weather?: OpenMeteoCurrentWeather;
};

@Injectable()
export class WeatherService {
  constructor(private readonly http: HttpService) {}

  async getCurrentByCoords(
    lat: number,
    lon: number,
    city: string | null = null,
  ): Promise<WeatherDto> {
    const url = 'https://api.open-meteo.com/v1/forecast';

    try {
      const { data } = await firstValueFrom(
        this.http.get<OpenMeteoResponse>(url, {
          timeout: 8000,
          params: {
            latitude: lat,
            longitude: lon,
            current_weather: true,
            timezone: 'auto',
          },
        }),
      );

      const cw = data.current_weather;
      if (!cw) throw new Error('Missing current_weather');

      const { temperature, windspeed, weathercode, time } = cw;

      if (
        typeof temperature !== 'number' ||
        !Number.isFinite(temperature) ||
        typeof windspeed !== 'number' ||
        !Number.isFinite(windspeed) ||
        typeof weathercode !== 'number' ||
        !Number.isFinite(weathercode) ||
        typeof time !== 'string' ||
        time.length === 0
      ) {
        throw new Error('Invalid response from open-meteo');
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
