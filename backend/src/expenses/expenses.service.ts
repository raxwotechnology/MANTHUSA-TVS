import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExpenseDocument } from './schemas/expense.schema';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectModel('Expense') private expenseModel: Model<ExpenseDocument>
  ) {}

  async create(createExpenseDto: any): Promise<ExpenseDocument> {
    const createdExpense = new this.expenseModel(createExpenseDto);
    return createdExpense.save();
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
