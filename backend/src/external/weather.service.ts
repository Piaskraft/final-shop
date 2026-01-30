import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

type GeoResult = {
  results?: Array<{
    name: string;
    latitude: number;
    longitude: number;
  }>;
};

type ForecastResult = {
  current?: {
    time: string;
    temperature_2m: number;
    wind_speed_10m: number;
    weather_code: number;
  };
};

@Injectable()
export class WeatherService {
  constructor(private readonly http: HttpService) {}

  async getCurrent(city: string) {
    const q = (city ?? '').trim();
    if (!q) throw new BadRequestException('city query param is required');

    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      q,
    )}&count=1&language=de&format=json`;

    let lat: number;
    let lon: number;

    try {
      const geoRes = await firstValueFrom(this.http.get<GeoResult>(geoUrl));
      const hit = geoRes.data?.results?.[0];
      if (!hit) throw new BadRequestException(`City not found: ${q}`);
      lat = hit.latitude;
      lon = hit.longitude;
    } catch (e: any) {
      if (e?.status === 400) throw e;
      throw new ServiceUnavailableException('Weather geocoding failed');
    }

    return this.getCurrentByCoords(lat, lon, q);
  }

  async getCurrentByCoords(lat: number, lon: number, city?: string) {
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      throw new BadRequestException('lat and lon must be valid numbers');
    }

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,weather_code&timezone=Europe%2FBerlin`;

    try {
      const res = await firstValueFrom(this.http.get<ForecastResult>(url));
      const cur = res.data?.current;
      if (!cur) throw new ServiceUnavailableException('Weather data missing');

      return {
        provider: 'open-meteo.com',
        city: city ?? null,
        lat,
        lon,
        temperature: cur.temperature_2m,
        windspeed: cur.wind_speed_10m,
        weathercode: cur.weather_code,
        time: cur.time,
      };
    } catch {
      throw new ServiceUnavailableException('Weather API error');
    }
  }
}
