import { Test, TestingModule } from '@nestjs/testing';
import { AfterSalesService } from './after-sales.service';

describe('AfterSalesService', () => {
  let service: AfterSalesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AfterSalesService],
    }).useMocker(() => ({})).compile();

    service = module.get<AfterSalesService>(AfterSalesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
