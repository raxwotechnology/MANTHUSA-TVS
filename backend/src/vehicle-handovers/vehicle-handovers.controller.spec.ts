import { Test, TestingModule } from '@nestjs/testing';
import { VehicleHandoversController } from './vehicle-handovers.controller';

describe('VehicleHandoversController', () => {
  let controller: VehicleHandoversController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehicleHandoversController],
    }).compile();

    controller = module.get<VehicleHandoversController>(VehicleHandoversController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
