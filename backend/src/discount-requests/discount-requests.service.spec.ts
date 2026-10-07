import { Test, TestingModule } from '@nestjs/testing';
import { DiscountRequestsService } from './discount-requests.service';

describe('DiscountRequestsService', () => {
  let service: DiscountRequestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiscountRequestsService],
    }).useMocker(() => ({})).compile();

    service = module.get<DiscountRequestsService>(DiscountRequestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
