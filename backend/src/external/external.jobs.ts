import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ExternalService } from './external.service';

@Injectable()
export class ExternalJobs {
  private readonly logger = new Logger(ExternalJobs.name);

  // Domyślne dane (Essen)
  private readonly DEFAULT_BASE = 'EUR';
  private readonly DEFAULT_TARGET = 'PLN';
  private readonly ESSEN_LAT = 51.4556;
  private readonly ESSEN_LON = 7.0116;

  constructor(private readonly external: ExternalService) {}

  // co 10 minut odświeżamy cache
  @Cron('*/10 * * * *')
  async warmCache(): Promise<void> {
    try {
      await this.external.getExchangeRate(
        this.DEFAULT_BASE,
        this.DEFAULT_TARGET,
      );
      await this.external.getWeather(this.ESSEN_LAT, this.ESSEN_LON, 'Essen');
      this.logger.log('External cache warmed (rate + weather)');
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : typeof err === 'string'
            ? err
            : JSON.stringify(err);

      this.logger.warn(`Warm cache failed: ${message}`);
    }
  }
}
