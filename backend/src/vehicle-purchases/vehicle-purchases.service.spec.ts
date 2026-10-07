import { Test, TestingModule } from '@nestjs/testing';
import { VehiclePurchasesService } from './vehicle-purchases.service';

describe('VehiclePurchasesService', () => {
  let service: VehiclePurchasesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VehiclePurchasesService],
    }).useMocker(() => ({})).compile();

    service = module.get<VehiclePurchasesService>(VehiclePurchasesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
