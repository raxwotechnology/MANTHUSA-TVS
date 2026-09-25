import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CashTransactionDocument } from './schemas/cash-transaction.schema';

@Injectable()
export class CashTransactionsService {
  constructor(
    @InjectModel('CashTransaction') private cashTxModel: Model<CashTransactionDocument>
  ) {}

  async create(createTxDto: any): Promise<CashTransactionDocument> {
    const createdTx = new this.cashTxModel(createTxDto);
    return createdTx.save();
  }

  async findAll(): Promise<CashTransactionDocument[]> {
    return this.cashTxModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<CashTransactionDocument> {
    const tx = await this.cashTxModel.findById(id).exec();
    if (!tx) {
      throw new NotFoundException(`Transaction #${id} not found`);
    }
    return tx;
  }
}
