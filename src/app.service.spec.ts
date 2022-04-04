import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('Should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('GetHello', () => {
    it('get hello', async () => {
      const getHello = await service.getHello();

      expect(getHello).toBe('Hello World!');
    });
  });
});
