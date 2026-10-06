import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel('Sale') private readonly sales: Model<any>,
    @InjectModel('Vehicle') private readonly vehicles: Model<any>,
    @InjectModel('Expense') private readonly expenses: Model<any>,
    @InjectModel('Branch') private readonly branches: Model<any>,
    @InjectModel('Lead') private readonly leads: Model<any>,
  ) {}

  async summary(from?: string, to?: string) {
    const match: Record<string, any> = { status: { $nin: ['Cancelled', 'Refunded'] } };
    if (from || to) {
      match.saleDate = {};
      if (from) match.saleDate.$gte = new Date(from);
      if (to) { const end = new Date(to); end.setHours(23, 59, 59, 999); match.saleDate.$lte = end; }
    }
    const [saleRows, stockRows, expenseRows, soldSales] = await Promise.all([
      this.sales.aggregate([{ $match: match }, { $group: { _id: null, count: { $sum: 1 }, revenue: { $sum: '$finalAmount' }, collected: { $sum: '$paidAmount' }, outstanding: { $sum: '$balance' } } }]).exec(),
      this.vehicles.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]).exec(),
      this.expenses.aggregate([{ $match: from || to ? { expenseDate: { ...(from ? { $gte: new Date(from) } : {}), ...(to ? { $lte: new Date(to) } : {}) } } : {} }, { $group: { _id: null, total: { $sum: '$amount' } } }]).exec(),
      this.sales.find(match).populate('vehicle').exec(),
    ]);
    const sales = saleRows[0] || { count: 0, revenue: 0, collected: 0, outstanding: 0 };
    const inventory = Object.fromEntries(stockRows.map((row) => [row._id, row.count]));
    const expenses = expenseRows[0]?.total || 0;
    const costOfGoods = soldSales.reduce((sum, sale) => sum + Number(sale.vehicle?.totalInvestment || sale.vehicle?.purchasePrice || 0), 0);
    const grossProfit = Number(sales.revenue || 0) - costOfGoods;
    return { salesCount: sales.count, revenue: sales.revenue, paymentsCollected: sales.collected, outstanding: sales.outstanding, expenses, costOfGoods, grossProfit, netAfterExpenses: grossProfit - expenses, inventory };
  }

  async agingStock() {
    const rows = await this.vehicles.find({ status: { $nin: ['Sold', 'Inactive'] } }).select('stockNumber make model year registrationNumber status sellingPrice createdAt').sort({ createdAt: 1 }).lean().exec();
    const now = Date.now();
    return rows.map((vehicle) => {
      const daysInStock = Math.max(0, Math.floor((now - new Date(vehicle.createdAt || now).getTime()) / 86400000));
      const ageBand = daysInStock <= 30 ? '0-30' : daysInStock <= 60 ? '31-60' : daysInStock <= 90 ? '61-90' : '90+';
      return { ...vehicle, daysInStock, ageBand };
    });
  }

  async profitLoss(from?: string, to?: string) {
    const summary = await this.summary(from, to);
    return { revenue: summary.revenue, costOfGoods: summary.costOfGoods, grossProfit: summary.grossProfit, operatingExpenses: summary.expenses, netProfit: summary.netAfterExpenses };
  }

  async salesByMonth(year = new Date().getFullYear()) {
    return this.sales.aggregate([
      { $match: { saleDate: { $gte: new Date(year, 0, 1), $lt: new Date(year + 1, 0, 1) }, status: { $nin: ['Cancelled', 'Refunded'] } } },
      { $group: { _id: { $month: '$saleDate' }, count: { $sum: 1 }, revenue: { $sum: '$finalAmount' } } },
      { $sort: { _id: 1 } },
    ]).exec();
  }

  async byBranch(from?: string, to?: string) {
    const dates: Record<string, Date> = {};
    if (from) dates.$gte = new Date(from);
    if (to) { const end = new Date(to); end.setHours(23, 59, 59, 999); dates.$lte = end; }
    const saleMatch: Record<string, any> = { status: { $nin: ['Cancelled', 'Refunded'] } };
    if (Object.keys(dates).length) saleMatch.saleDate = dates;
    const [sales, expenses, branches] = await Promise.all([
      this.sales.aggregate([
        { $match: saleMatch },
        { $lookup: { from: this.vehicles.collection.name, localField: 'vehicle', foreignField: '_id', as: 'vehicleRow' } },
        { $unwind: { path: '$vehicleRow', preserveNullAndEmptyArrays: true } },
        { $addFields: { reportBranch: { $ifNull: ['$branch', { $ifNull: ['$vehicleRow.branch', '$vehicleRow.location'] }] }, vehicleCost: { $ifNull: ['$vehicleRow.totalInvestment', { $ifNull: ['$vehicleRow.purchasePrice', 0] }] } } },
        { $group: { _id: '$reportBranch', salesCount: { $sum: 1 }, revenue: { $sum: '$finalAmount' }, costOfGoods: { $sum: '$vehicleCost' } } },
      ]).exec(),
      this.expenses.aggregate([{ $match: Object.keys(dates).length ? { expenseDate: dates } : {} }, { $group: { _id: '$branch', expenses: { $sum: '$amount' } } }]).exec(),
      this.branches.find({}).select('name location').lean().exec(),
    ]);
    const branchKey = (id: any) => id?.toString() || 'unassigned';
    const ids = new Set([...sales, ...expenses].map(row => branchKey(row._id)));
    return [...ids].map(id => {
      const sale = sales.find(row => branchKey(row._id) === id), expense = expenses.find(row => branchKey(row._id) === id);
      const branch = id === 'unassigned' ? undefined : branches.find(row => row._id.toString() === id);
      const revenue = Number(sale?.revenue || 0), costOfGoods = Number(sale?.costOfGoods || 0), operatingExpenses = Number(expense?.expenses || 0);
      return { branchId: id === 'unassigned' ? null : id, branchName: branch?.name || 'Unassigned', salesCount: sale?.salesCount || 0, revenue, costOfGoods, grossProfit: revenue - costOfGoods, operatingExpenses, netProfit: revenue - costOfGoods - operatingExpenses };
    }).sort((a, b) => b.revenue - a.revenue);
  }

  async salesByCategory(year = new Date().getFullYear()) {
    return this.sales.aggregate([
      { $match: { saleDate: { $gte: new Date(year, 0, 1), $lt: new Date(year + 1, 0, 1) }, status: { $nin: ['Cancelled', 'Refunded'] } } },
      { $lookup: { from: this.vehicles.collection.name, localField: 'vehicle', foreignField: '_id', as: 'vehicleRow' } },
      { $unwind: { path: '$vehicleRow', preserveNullAndEmptyArrays: true } },
      { $group: { _id: { $ifNull: ['$vehicleRow.vehicleType', 'Unspecified'] }, salesCount: { $sum: 1 }, revenue: { $sum: '$finalAmount' } } },
      { $sort: { revenue: -1 } },
    ]).exec();
  }

  async leadConversion() {
    const rows = await this.leads.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }, { $sort: { count: -1 } }]).exec();
    const total = rows.reduce((sum, row) => sum + row.count, 0);
    const won = rows.filter(row => ['Won', 'Reserved', 'Sold', 'Completed'].includes(row._id)).reduce((sum, row) => sum + row.count, 0);
    return { total, converted: won, conversionRate: total ? Math.round((won / total) * 10000) / 100 : 0, statuses: rows };
  }

  async accountingExport(format: string = 'quickbooks') {
    const [sales, expenses] = await Promise.all([
      this.sales.find({ status: { $nin: ['Cancelled'] } }).populate('customer').populate('vehicle').lean().exec(),
      this.expenses.find().populate('vehicle').lean().exec()
    ]);

    const type = String(format || 'quickbooks').toLowerCase();
    if (type === 'xero') {
      let csv = '*ContactName,*InvoiceNumber,*InvoiceDate,*DueDate,*Total,*Description,*AccountCode,*TaxType\n';
      sales.forEach(s => {
        const contact = s.customer?.name || 'Customer';
        const invNum = s.saleNumber || s._id;
        const date = s.saleDate ? new Date(s.saleDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
        const total = s.finalAmount || 0;
        const desc = `${s.vehicle?.make || ''} ${s.vehicle?.model || ''} - VIN ${s.vehicle?.chassisNumber || ''}`;
        csv += `"${contact}","${invNum}","${date}","${date}",${total},"${desc}","200","OUTPUT"\n`;
      });
      expenses.forEach(e => {
        const contact = e.payee || 'Supplier/Vendor';
        const invNum = e.expenseNumber || e._id;
        const date = e.expenseDate ? new Date(e.expenseDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
        const total = e.amount || 0;
        const desc = `${e.category || 'Expense'} - ${e.description || ''}`;
        csv += `"${contact}","${invNum}","${date}","${date}",${total},"${desc}","400","INPUT"\n`;
      });
      return { format: 'xero', filename: 'Xero_Accounting_Export.csv', content: csv };
    } else {
      let csv = 'TransactionType,DocNumber,Date,Customer/Vendor,Amount,Memo,Account\n';
      sales.forEach(s => {
        const contact = s.customer?.name || 'Customer';
        const invNum = s.saleNumber || s._id;
        const date = s.saleDate ? new Date(s.saleDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
        const total = s.finalAmount || 0;
        const desc = `Vehicle Sale: ${s.vehicle?.make || ''} ${s.vehicle?.model || ''}`;
        csv += `"Invoice","${invNum}","${date}","${contact}",${total},"${desc}","Sales Income"\n`;
      });
      expenses.forEach(e => {
        const contact = e.payee || 'Vendor';
        const invNum = e.expenseNumber || e._id;
        const date = e.expenseDate ? new Date(e.expenseDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
        const total = e.amount || 0;
        const desc = `Vehicle Expense: ${e.category || ''} - ${e.description || ''}`;
        csv += `"Expense","${invNum}","${date}","${contact}",${total},"${desc}","Vehicle Expense"\n`;
      });
      return { format: 'quickbooks', filename: 'QuickBooks_Accounting_Export.csv', content: csv };
    }
  }
}
