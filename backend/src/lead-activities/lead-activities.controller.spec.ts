import { Test, TestingModule } from '@nestjs/testing';
import { LeadActivitiesController } from './lead-activities.controller';

describe('LeadActivitiesController', () => {
  let controller: LeadActivitiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeadActivitiesController],
    }).compile();

    controller = module.get<LeadActivitiesController>(LeadActivitiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
