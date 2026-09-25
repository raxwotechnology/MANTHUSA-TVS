import { Test, TestingModule } from '@nestjs/testing';
import { CashTransactionsController } from './cash-transactions.controller';

describe('CashTransactionsController', () => {
  let controller: CashTransactionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CashTransactionsController],
    }).compile();

    controller = module.get<CashTransactionsController>(CashTransactionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
