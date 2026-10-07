import { Test, TestingModule } from '@nestjs/testing';
import { LeadActivitiesService } from './lead-activities.service';

describe('LeadActivitiesService', () => {
  let service: LeadActivitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LeadActivitiesService],
    }).useMocker(() => ({})).compile();

    service = module.get<LeadActivitiesService>(LeadActivitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
