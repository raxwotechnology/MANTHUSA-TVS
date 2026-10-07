import { Test, TestingModule } from '@nestjs/testing';
import { AfterSalesController } from './after-sales.controller';

describe('AfterSalesController', () => {
  let controller: AfterSalesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AfterSalesController],
    }).useMocker(() => ({})).compile();

    controller = module.get<AfterSalesController>(AfterSalesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
