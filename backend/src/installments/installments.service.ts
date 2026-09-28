import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class InstallmentsService {
  constructor(
    @InjectModel('Installment') private readonly installments: Model<any>,
    @InjectModel('InstallmentAgreement') private readonly agreements: Model<any>,
    @InjectModel('Sale') private readonly sales: Model<any>,
    @InjectModel('CashTransaction') private readonly cash: Model<any>,
  ) {}

  async createAgreement(input: any) {
    const months = Number(input.loanPeriodMonths);
    const principal = Number(input.loanAmount);
    const downPayment = Number(input.downPayment || 0);
    const rate = Number(input.interestRate || 0) / 1200;
    const start = new Date(input.startDate);
    if (!input.sale || !input.customer || !input.financeCompany || !Number.isInteger(months) || months < 1 || principal <= 0 || downPayment < 0 || downPayment > principal || Number.isNaN(start.getTime())) {
      throw new BadRequestException('Sale, customer, finance company, valid loan amount/term and start date are required.');
    }
    const sale = await this.sales.findById(input.sale).exec();
    if (!sale) throw new NotFoundException('Sale not found.');
    const loanAmount = principal - downPayment;
    const monthlyInstallment = Number(input.monthlyInstallment) || (rate ? loanAmount * rate / (1 - Math.pow(1 + rate, -months)) : loanAmount / months);
    const endDate = new Date(start); endDate.setMonth(endDate.getMonth() + months - 1);
    const agreement = await new this.agreements({ ...input, loanAmount, downPayment, monthlyInstallment, loanPeriodMonths: months, endDate }).save();
    const schedule = Array.from({ length: months }, (_, i) => {
      const dueDate = new Date(start); dueDate.setMonth(dueDate.getMonth() + i);
      return { agreement: agreement._id, installmentNumber: i + 1, dueDate, amount: monthlyInstallment, status: 'Pending' };
    });
    await this.installments.insertMany(schedule);
    return { agreement, schedule };
  }

  listAgreements() { return this.agreements.find().populate('sale').populate('customer').sort({ createdAt: -1 }).exec(); }
  async getSchedule(agreementId: string) {
    const agreement = await this.agreements.findById(agreementId).exec();
    if (!agreement) throw new NotFoundException('Finance agreement not found.');
    const rows = await this.installments.find({ agreement: agreementId }).sort({ installmentNumber: 1 }).exec();
    const now = new Date();
    return rows.map((row) => row.status === 'Pending' && row.dueDate < now ? { ...row.toObject(), status: 'Overdue' } : row);
  }

  async markPaid(id: string, input: any) {
    const installment = await this.installments.findById(id).exec();
    if (!installment) throw new NotFoundException('Installment not found.');
    if (installment.status === 'Paid') throw new BadRequestException('Installment has already been paid.');
    const agreement = await this.agreements.findById(installment.agreement).exec();
    if (!agreement) throw new NotFoundException('Finance agreement not found.');
    installment.status = 'Paid'; installment.paidDate = input.paidDate ? new Date(input.paidDate) : new Date();
    await installment.save();
    await new this.cash({ transactionType: 'IN', amount: installment.amount, transactionDate: installment.paidDate, source: 'CustomerPayment', referenceId: installment._id, description: `Finance installment ${installment.installmentNumber}` }).save();
    return installment;
  }
}
