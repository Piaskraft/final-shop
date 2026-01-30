import { BadGatewayException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

type FrankfurterResponse = {
  amount: number;
  base: string;
  date: string;
  rates: Record<string, number>;
};

@Injectable()
export class CurrencyService {
  constructor(private readonly http: HttpService) {}

  async getRate(base: string, target: string) {
    const from = String(base || 'EUR').toUpperCase();
    const to = String(target || 'PLN').toUpperCase();

    if (from === to) {
      return {
        provider: 'frankfurter.app',
        base: from,
        target: to,
        rate: 1,
        date: new Date().toISOString().slice(0, 10),
      };
    }

    try {
      const { data } = await firstValueFrom(
        this.http.get<FrankfurterResponse>('https://api.frankfurter.app/latest', {
          params: { from, to },
          timeout: 8000,
        }),
      );

      const rate = data?.rates?.[to];
      if (typeof rate !== 'number') throw new Error('Rate missing');

      return {
        provider: 'frankfurter.app',
        base: from,
        target: to,
        rate,
        date: data?.date ?? null,
      };
    } catch {
      throw new BadGatewayException('External currency API error');
    }
  }
}
