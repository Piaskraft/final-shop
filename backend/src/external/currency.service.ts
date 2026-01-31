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

type FrankfurterLatestResponse = {
  amount?: number;
  base: string;
  date: string;
  rates: Record<string, number>;
};

@Injectable()
export class CurrencyService {
  constructor(private readonly http: HttpService) {}

  async getRate(base = 'EUR', target = 'PLN'): Promise<ExchangeRateDto> {
    const from = (base || 'EUR').toUpperCase();
    const to = (target || 'PLN').toUpperCase();

    const url = 'https://api.frankfurter.app/latest';

    try {
      const { data } = await firstValueFrom(
        this.http.get<FrankfurterLatestResponse>(url, {
          timeout: 8000,
          params: { from, to },
        }),
      );

      const rate = data.rates?.[to];
      const date = data.date;

      if (typeof rate !== 'number' || !Number.isFinite(rate) || !date) {
        throw new Error('Invalid response from frankfurter');
      }

      return {
        provider: 'frankfurter.app',
        base: from,
        target: to,
        rate,
        date,
      };
    } catch {
      throw new BadGatewayException('External currency API error');
    }
  }
}
