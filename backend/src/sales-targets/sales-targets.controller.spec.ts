import { Test, TestingModule } from '@nestjs/testing';
import { SalesTargetsController } from './sales-targets.controller';

describe('SalesTargetsController', () => {
  let controller: SalesTargetsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalesTargetsController],
    }).useMocker(() => ({})).compile();

    controller = module.get<SalesTargetsController>(SalesTargetsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
