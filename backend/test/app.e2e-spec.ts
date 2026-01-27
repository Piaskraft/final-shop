import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import type { Server } from 'http';

jest.setTimeout(20000);

describe('App (e2e)', () => {
  let app: INestApplication;

  const prismaMock = {
    product: {
      findUnique: jest.fn(),
    },
  } as unknown as PrismaService;
  let server: Server;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    server = app.getHttpServer() as unknown as Server;
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET / should return Hello World', async () => {
    await request(server).get('/').expect(200);
  });

  it('GET /products/abc should return 400 (ParseIntPipe)', async () => {
    await request(server).get('/products/abc').expect(400);
  });

  it('GET /products/999999 should return 404 when not found', async () => {
    prismaMock.product.findUnique = jest.fn().mockResolvedValue(null);

    await request(server).get('/products/999999').expect(404);
  });
});
