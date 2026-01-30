import { Injectable, BadGatewayException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

export type ExchangeRateDto = {
  provider: 'frankfurter.app';
  base: string;
  target: string;
  rate: number;
  date: string;
};

@Injectable()
export class CurrencyService {
  constructor(private readonly http: HttpService) {}

  async getRate(base = 'EUR', target = 'PLN'): Promise<ExchangeRateDto> {
    const from = (base || 'EUR').toUpperCase();
    const to = (target || 'PLN').toUpperCase();

    const url =
      `https://api.frankfurter.app/latest?from=${encodeURIComponent(from)}` +
      `&to=${encodeURIComponent(to)}`;

    try {
      const { data } = await firstValueFrom(
        this.http.get(url, { timeout: 8000 }),
      );

      const rate = Number(data?.rates?.[to]);
      const date = String(data?.date ?? '');

      if (!Number.isFinite(rate) || !date) throw new Error('Invalid response');

      return { provider: 'frankfurter.app', base: from, target: to, rate, date };
    } catch {
      throw new BadGatewayException('External currency API error');
    }
  }
}
