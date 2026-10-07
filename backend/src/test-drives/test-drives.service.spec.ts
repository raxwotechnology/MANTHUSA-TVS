import { Test, TestingModule } from '@nestjs/testing';
import { TestDrivesService } from './test-drives.service';

describe('TestDrivesService', () => {
  let service: TestDrivesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestDrivesService],
    }).useMocker(() => ({})).compile();

    service = module.get<TestDrivesService>(TestDrivesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
