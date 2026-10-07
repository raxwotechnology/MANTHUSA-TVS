import { Test, TestingModule } from '@nestjs/testing';
import { DiscountRequestsController } from './discount-requests.controller';

describe('DiscountRequestsController', () => {
  let controller: DiscountRequestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiscountRequestsController],
    }).useMocker(() => ({})).compile();

    controller = module.get<DiscountRequestsController>(DiscountRequestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
