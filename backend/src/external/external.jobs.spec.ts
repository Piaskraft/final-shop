import { Test } from '@nestjs/testing';
import { ExternalJobs } from './external.jobs';
import { ExternalService } from './external.service';

describe('ExternalJobs', () => {
  let jobs: ExternalJobs;

  const externalServiceMock = {
    getExchangeRate: jest.fn(),
    getWeather: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      providers: [
        ExternalJobs,
        { provide: ExternalService, useValue: externalServiceMock },
      ],
    }).compile();

    jobs = moduleRef.get(ExternalJobs);
  });

  it('warmCache(): calls getExchangeRate and getWeather with defaults', async () => {
    externalServiceMock.getExchangeRate.mockResolvedValue({ data: {}, cacheHit: false });
    externalServiceMock.getWeather.mockResolvedValue({ data: {}, cacheHit: false });

    await jobs.warmCache();

    expect(externalServiceMock.getExchangeRate).toHaveBeenCalledWith('EUR', 'PLN');
    expect(externalServiceMock.getWeather).toHaveBeenCalledWith(51.4556, 7.0116, 'Essen');
  });
});
