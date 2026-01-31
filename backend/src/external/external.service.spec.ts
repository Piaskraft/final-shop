import { Test } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ExternalService } from './external.service';
import { CurrencyService } from './currency.service';
import { WeatherService } from './weather.service';

describe('ExternalService', () => {
  let service: ExternalService;

  const cacheMock = {
    get: jest.fn(),
    set: jest.fn(),
  };

  const currencyMock = {
    getRate: jest.fn(),
  };

  const weatherMock = {
    getCurrentByCoords: jest.fn(),
  };

  const RATE = {
    provider: 'frankfurter.app' as const,
    base: 'EUR',
    target: 'PLN',
    rate: 4.2,
    date: '2026-01-31',
  };

  const WEATHER = {
    provider: 'open-meteo.com' as const,
    city: 'Berlin',
    lat: 52.52,
    lon: 13.41,
    temperature: 1,
    windspeed: 10,
    weathercode: 3,
    time: '2026-01-31T12:00',
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      providers: [
        ExternalService,
        { provide: CACHE_MANAGER, useValue: cacheMock },
        { provide: CurrencyService, useValue: currencyMock },
        { provide: WeatherService, useValue: weatherMock },
      ],
    }).compile();

    service = moduleRef.get(ExternalService);
  });

  it('getExchangeRate(): returns cached value when present', async () => {
    cacheMock.get.mockResolvedValue(RATE);

    const result = await service.getExchangeRate('eur', 'pln');

    expect(result).toEqual({ data: RATE, cacheHit: true });
    expect(currencyMock.getRate).not.toHaveBeenCalled();
  });

  it('getExchangeRate(): fetches and caches when missing', async () => {
    cacheMock.get.mockResolvedValue(null);
    currencyMock.getRate.mockResolvedValue(RATE);

    const result = await service.getExchangeRate('EUR', 'PLN');

    expect(result).toEqual({ data: RATE, cacheHit: false });
    expect(currencyMock.getRate).toHaveBeenCalledWith('EUR', 'PLN');
    expect(cacheMock.set).toHaveBeenCalledWith(
      'rate:EUR:PLN',
      RATE,
      600,
    );
  });

  it('getWeather(): returns cached value when present', async () => {
    cacheMock.get.mockResolvedValue(WEATHER);

    const result = await service.getWeather(52.52, 13.41, 'Berlin');

    expect(result).toEqual({ data: WEATHER, cacheHit: true });
    expect(weatherMock.getCurrentByCoords).not.toHaveBeenCalled();
  });

  it('getWeather(): fetches and caches when missing', async () => {
    cacheMock.get.mockResolvedValue(null);
    weatherMock.getCurrentByCoords.mockResolvedValue(WEATHER);

    const result = await service.getWeather(52.52, 13.41, 'Berlin');

    expect(result).toEqual({ data: WEATHER, cacheHit: false });
    expect(weatherMock.getCurrentByCoords).toHaveBeenCalledWith(52.52, 13.41, 'Berlin');

    expect(cacheMock.set).toHaveBeenCalledWith(
      'weather:52.5200:13.4100',
      WEATHER,
      600,
    );
  });
});
