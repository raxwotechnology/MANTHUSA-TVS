import { Test, TestingModule } from '@nestjs/testing';
import { VehiclePurchasesController } from './vehicle-purchases.controller';

describe('VehiclePurchasesController', () => {
  let controller: VehiclePurchasesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehiclePurchasesController],
    }).compile();

    controller = module.get<VehiclePurchasesController>(VehiclePurchasesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
