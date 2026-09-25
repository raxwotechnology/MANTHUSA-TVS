import { Test, TestingModule } from '@nestjs/testing';
import { VehicleHandoversService } from './vehicle-handovers.service';

describe('VehicleHandoversService', () => {
  let service: VehicleHandoversService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VehicleHandoversService],
    }).compile();

    service = module.get<VehicleHandoversService>(VehicleHandoversService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
