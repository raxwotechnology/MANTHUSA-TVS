import { Test, TestingModule } from '@nestjs/testing';
import { SalesTargetsService } from './sales-targets.service';

describe('SalesTargetsService', () => {
  let service: SalesTargetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SalesTargetsService],
    }).compile();

    service = module.get<SalesTargetsService>(SalesTargetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
