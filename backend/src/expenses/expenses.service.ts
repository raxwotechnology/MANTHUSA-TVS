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
    const existingExpense = await this.expenseModel.findByIdAndUpdate(
      id,
      updateExpenseDto,
      { new: true }
    ).exec();
    if (!existingExpense) {
      throw new NotFoundException(`Expense #${id} not found`);
    }
    return existingExpense;
  }

  async remove(id: string): Promise<any> {
    const deletedExpense = await this.expenseModel.findByIdAndDelete(id).exec();
    if (!deletedExpense) {
      throw new NotFoundException(`Expense #${id} not found`);
    }
    return deletedExpense;
  }
}
