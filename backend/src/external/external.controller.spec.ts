import { Test } from '@nestjs/testing';
import { ExternalController } from './external.controller';
import { ExternalService } from './external.service';

describe('ExternalController', () => {
  let controller: ExternalController;

  const externalServiceMock = {
    getExchangeRate: jest.fn(),
    getWeather: jest.fn(),
  };

  const resMock = {
    setHeader: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      controllers: [ExternalController],
      providers: [{ provide: ExternalService, useValue: externalServiceMock }],
    }).compile();

    controller = moduleRef.get(ExternalController);
  });

  it('getRate(): sets X-Cache and returns data', async () => {
    externalServiceMock.getExchangeRate.mockResolvedValue({
      data: {
        provider: 'frankfurter.app',
        base: 'EUR',
        target: 'PLN',
        rate: 4.0,
        date: '2026-01-31',
      },
      cacheHit: true,
    });

    const result = await controller.getRate(resMock as any, 'EUR', 'PLN');

    expect(result).toEqual({
      provider: 'frankfurter.app',
      base: 'EUR',
      target: 'PLN',
      rate: 4.0,
      date: '2026-01-31',
    });

    expect(externalServiceMock.getExchangeRate).toHaveBeenCalledWith('EUR', 'PLN');
    expect(resMock.setHeader).toHaveBeenCalledWith('X-Cache', 'HIT');
  });

  it('getWeather(): parses lat/lon strings, sets X-Cache and returns data', async () => {
    externalServiceMock.getWeather.mockResolvedValue({
      data: {
        provider: 'open-meteo.com',
        city: 'Berlin',
        lat: 52.52,
        lon: 13.41,
        temperature: 1,
        windspeed: 10,
        weathercode: 3,
        time: '2026-01-31T12:00',
      },
      cacheHit: false,
    });

    const result = await controller.getWeather(
      resMock as any,
      '52.52',
      '13.41',
      'Berlin',
    );

    expect(result).toEqual({
      provider: 'open-meteo.com',
      city: 'Berlin',
      lat: 52.52,
      lon: 13.41,
      temperature: 1,
      windspeed: 10,
      weathercode: 3,
      time: '2026-01-31T12:00',
    });

    expect(externalServiceMock.getWeather).toHaveBeenCalledWith(52.52, 13.41, 'Berlin');
    expect(resMock.setHeader).toHaveBeenCalledWith('X-Cache', 'MISS');
  });
});
