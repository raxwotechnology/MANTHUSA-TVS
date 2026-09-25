import { Test, TestingModule } from '@nestjs/testing';
import { TestDrivesController } from './test-drives.controller';

describe('TestDrivesController', () => {
  let controller: TestDrivesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestDrivesController],
    }).compile();

    controller = module.get<TestDrivesController>(TestDrivesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
