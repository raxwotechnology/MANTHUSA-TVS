import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExpenseDocument } from './schemas/expense.schema';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectModel('Expense') private expenseModel: Model<ExpenseDocument>,
    @InjectModel('ExpenseCategory') private categoryModel: Model<any>,
    @InjectModel('CashTransaction') private cashModel: Model<any>,
  ) {}

  async create(createExpenseDto: any): Promise<ExpenseDocument> {
    const amount = Number(createExpenseDto.amount);
    if (!Number.isFinite(amount) || amount <= 0 || !createExpenseDto.expenseDate) throw new BadRequestException('A positive amount and expense date are required.');
    let category = createExpenseDto.category;
    if (typeof category === 'string' && !/^[a-f\d]{24}$/i.test(category)) {
      category = (await this.categoryModel.findOneAndUpdate({ name: category.trim() }, { $setOnInsert: { name: category.trim() } }, { upsert: true, new: true }))._id;
    }
    const createdExpense = await new this.expenseModel({ ...createExpenseDto, category, amount, expenseId: createExpenseDto.expenseId || `EXP-${Date.now()}` }).save();
    await new this.cashModel({ transactionType: 'OUT', amount, transactionDate: createdExpense.expenseDate, source: 'Expense', referenceId: createdExpense._id, description: createdExpense.description || 'Business expense' }).save();
    return createdExpense;
  }

  async findAll(): Promise<ExpenseDocument[]> {
    return this.expenseModel.find().populate('category').sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<ExpenseDocument> {
    const expense = await this.expenseModel.findById(id).populate('category').exec();
    if (!expense) {
      throw new NotFoundException(`Expense #${id} not found`);
    }
    return expense;
  }

  async update(id: string, updateExpenseDto: any): Promise<ExpenseDocument> {
    const existingExpense = await this.expenseModel.findById(id).exec();
    if (!existingExpense) {
      throw new NotFoundException(`Expense #${id} not found`);
    }
    const previousAmount = Number(existingExpense.amount);
    if (updateExpenseDto.amount !== undefined) {
      updateExpenseDto.amount = Number(updateExpenseDto.amount);
      if (!Number.isFinite(updateExpenseDto.amount) || updateExpenseDto.amount <= 0) throw new BadRequestException('Expense amount must be positive.');
    }
    if (typeof updateExpenseDto.category === 'string' && !/^[a-f\d]{24}$/i.test(updateExpenseDto.category)) {
      const categoryName = updateExpenseDto.category.trim();
      if (!categoryName) throw new BadRequestException('Expense category cannot be empty.');
      updateExpenseDto.category = (await this.categoryModel.findOneAndUpdate({ name: categoryName }, { $setOnInsert: { name: categoryName } }, { upsert: true, new: true }))._id;
    }
    Object.assign(existingExpense, updateExpenseDto);
    await existingExpense.save();
    const difference = Number(existingExpense.amount) - previousAmount;
    if (difference !== 0) await new this.cashModel({ transactionType: difference > 0 ? 'OUT' : 'IN', amount: Math.abs(difference), transactionDate: new Date(), source: 'ExpenseAdjustment', referenceId: existingExpense._id, description: `Adjustment for ${existingExpense.expenseId || existingExpense._id}` }).save();
    return existingExpense;
  }

  async remove(id: string): Promise<any> {
    const deletedExpense = await this.expenseModel.findByIdAndDelete(id).exec();
    if (!deletedExpense) {
      throw new NotFoundException(`Expense #${id} not found`);
    }
    await new this.cashModel({ transactionType: 'IN', amount: Number(deletedExpense.amount), transactionDate: new Date(), source: 'ExpenseReversal', referenceId: deletedExpense._id, description: `Reversal for deleted expense ${deletedExpense.expenseId || deletedExpense._id}` }).save();
    return deletedExpense;
  }
}
