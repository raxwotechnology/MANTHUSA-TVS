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
    @InjectModel('Customer') private readonly customers: Model<any>,
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

  async financialAnalysis(targetGrowthPct = 15) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonthIdx = now.getMonth();

    const currentMonthStart = new Date(currentYear, currentMonthIdx, 1);
    const currentMonthEnd = new Date(currentYear, currentMonthIdx + 1, 0, 23, 59, 59, 999);

    const prevMonthStart = new Date(currentYear, currentMonthIdx - 1, 1);
    const prevMonthEnd = new Date(currentYear, currentMonthIdx, 0, 23, 59, 59, 999);

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const currentMonthName = monthNames[currentMonthIdx];
    const prevMonthName = monthNames[(currentMonthIdx + 11) % 12];
    const nextMonthName = monthNames[(currentMonthIdx + 1) % 12];

    const [currentSalesAgg, prevSalesAgg, allSalesAgg, topModelsAgg, monthlyHistory] = await Promise.all([
      this.sales.aggregate([
        { $match: { saleDate: { $gte: currentMonthStart, $lte: currentMonthEnd }, status: { $nin: ['Cancelled', 'Refunded'] } } },
        { $group: { _id: null, count: { $sum: 1 }, revenue: { $sum: '$finalAmount' }, collected: { $sum: '$paidAmount' } } }
      ]).exec(),
      this.sales.aggregate([
        { $match: { saleDate: { $gte: prevMonthStart, $lte: prevMonthEnd }, status: { $nin: ['Cancelled', 'Refunded'] } } },
        { $group: { _id: null, count: { $sum: 1 }, revenue: { $sum: '$finalAmount' }, collected: { $sum: '$paidAmount' } } }
      ]).exec(),
      this.sales.aggregate([
        { $match: { status: { $nin: ['Cancelled', 'Refunded'] } } },
        { $group: { _id: null, count: { $sum: 1 }, revenue: { $sum: '$finalAmount' } } }
      ]).exec(),
      this.sales.aggregate([
        { $match: { status: { $nin: ['Cancelled', 'Refunded'] } } },
        { $group: { _id: '$modelName', count: { $sum: 1 }, revenue: { $sum: '$finalAmount' } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]).exec(),
      this.sales.aggregate([
        { $match: { status: { $nin: ['Cancelled', 'Refunded'] } } },
        { $group: {
            _id: { year: { $year: '$saleDate' }, month: { $month: '$saleDate' } },
            count: { $sum: 1 },
            revenue: { $sum: '$finalAmount' }
          }
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 6 }
      ]).exec()
    ]);

    const cur = currentSalesAgg[0] || { count: 0, revenue: 0, collected: 0 };
    const prev = prevSalesAgg[0] || { count: 0, revenue: 0, collected: 0 };

    // MoM difference & percentage
    const unitsDiff = cur.count - prev.count;
    const unitsGrowthPct = prev.count > 0 ? Math.round(((cur.count - prev.count) / prev.count) * 1000) / 10 : (cur.count > 0 ? 100 : 0);
    const unitsTrend = unitsDiff > 0 ? 'up' : unitsDiff < 0 ? 'down' : 'neutral';

    const revenueDiff = cur.revenue - prev.revenue;
    const revenueGrowthPct = prev.revenue > 0 ? Math.round(((cur.revenue - prev.revenue) / prev.revenue) * 1000) / 10 : (cur.revenue > 0 ? 100 : 0);
    const revenueTrend = revenueDiff > 0 ? 'up' : revenueDiff < 0 ? 'down' : 'neutral';

    // Projection & Target Analysis for Next Month
    const avgHistoricalRevenue = monthlyHistory.length ? (monthlyHistory.reduce((s, m) => s + m.revenue, 0) / monthlyHistory.length) : 5000000;
    const avgHistoricalUnits = monthlyHistory.length ? (monthlyHistory.reduce((s, m) => s + m.count, 0) / monthlyHistory.length) : 5;

    const baseRevenue = cur.revenue > 0 ? cur.revenue : Math.round(avgHistoricalRevenue);
    const baseUnits = cur.count > 0 ? cur.count : Math.max(1, Math.round(avgHistoricalUnits));
    const avgPricePerBike = cur.count > 0 ? Math.round(cur.revenue / cur.count) : (baseUnits > 0 ? Math.round(baseRevenue / baseUnits) : 850000);

    const growthPctNum = Number(targetGrowthPct) || 15;
    const growthFactor = 1 + growthPctNum / 100;
    const projectedTargetRevenue = Math.round(baseRevenue * growthFactor);
    const projectedTargetUnits = Math.ceil(baseUnits * growthFactor);
    const neededAdditionalUnits = Math.max(1, projectedTargetUnits - cur.count);
    const neededAdditionalRevenue = Math.max(0, projectedTargetRevenue - cur.revenue);

    const scenarios = [
      {
        tier: 'Conservative (+5%)',
        growthPct: 5,
        targetUnits: Math.ceil(baseUnits * 1.05),
        targetRevenue: Math.round(baseRevenue * 1.05),
        neededUnits: Math.max(1, Math.ceil(baseUnits * 1.05) - cur.count),
        neededRevenue: Math.max(0, Math.round(baseRevenue * 1.05) - cur.revenue),
      },
      {
        tier: 'Moderate Target (+10%)',
        growthPct: 10,
        targetUnits: Math.ceil(baseUnits * 1.10),
        targetRevenue: Math.round(baseRevenue * 1.10),
        neededUnits: Math.max(1, Math.ceil(baseUnits * 1.10) - cur.count),
        neededRevenue: Math.max(0, Math.round(baseRevenue * 1.10) - cur.revenue),
      },
      {
        tier: 'Standard Growth (+15%)',
        growthPct: 15,
        targetUnits: Math.ceil(baseUnits * 1.15),
        targetRevenue: Math.round(baseRevenue * 1.15),
        neededUnits: Math.max(1, Math.ceil(baseUnits * 1.15) - cur.count),
        neededRevenue: Math.max(0, Math.round(baseRevenue * 1.15) - cur.revenue),
      },
      {
        tier: 'Aggressive Expansion (+25%)',
        growthPct: 25,
        targetUnits: Math.ceil(baseUnits * 1.25),
        targetRevenue: Math.round(baseRevenue * 1.25),
        neededUnits: Math.max(1, Math.ceil(baseUnits * 1.25) - cur.count),
        neededRevenue: Math.max(0, Math.round(baseRevenue * 1.25) - cur.revenue),
      },
    ];

    return {
      currentMonth: {
        monthName: currentMonthName,
        year: currentYear,
        bikesSold: cur.count,
        revenue: cur.revenue,
        collected: cur.collected,
        avgPricePerBike: cur.count > 0 ? Math.round(cur.revenue / cur.count) : 0,
      },
      previousMonth: {
        monthName: prevMonthName,
        bikesSold: prev.count,
        revenue: prev.revenue,
        avgPricePerBike: prev.count > 0 ? Math.round(prev.revenue / prev.count) : 0,
      },
      monthOverMonth: {
        unitsDiff,
        unitsGrowthPct,
        unitsTrend,
        revenueDiff,
        revenueGrowthPct,
        revenueTrend,
      },
      nextMonthAnalysis: {
        nextMonthName,
        targetGrowthPct: growthPctNum,
        targetRevenue: projectedTargetRevenue,
        targetUnits: projectedTargetUnits,
        neededAdditionalUnits,
        neededAdditionalRevenue,
        avgPricePerBike,
        recommendation: `To achieve a ${growthPctNum}% revenue growth in ${nextMonthName}, the dealership needs to sell at least ${neededAdditionalUnits} more bikes (target: ${projectedTargetUnits} units), driving an extra LKR ${neededAdditionalRevenue.toLocaleString()} in revenue at an average transaction price of LKR ${avgPricePerBike.toLocaleString()} per motorcycle.`,
        scenarios,
      },
      topSellingModels: topModelsAgg.map(m => ({ model: m._id || 'Unspecified', units: m.count, revenue: m.revenue })),
      monthlyHistory: monthlyHistory.map(m => ({
        year: m._id.year,
        month: m._id.month,
        monthName: monthNames[m._id.month - 1],
        units: m.count,
        revenue: m.revenue,
      })),
    };
  }

  async customerAcquisition() {
    const [walkInCount, onlineCount, walkInSales, onlineSales] = await Promise.all([
      this.customers.countDocuments({ customerSource: { $in: ['Walk-in', 'Walk-in Customer', null, undefined] } }).exec(),
      this.customers.countDocuments({ customerSource: { $regex: /online/i } }).exec(),
      this.sales.aggregate([
        { $match: { status: { $nin: ['Cancelled', 'Refunded'] } } },
        { $lookup: { from: 'customers', localField: 'customer', foreignField: '_id', as: 'cust' } },
        { $unwind: { path: '$cust', preserveNullAndEmptyArrays: true } },
        { $match: { 'cust.customerSource': { $not: { $regex: /online/i } } } },
        { $group: { _id: null, count: { $sum: 1 }, revenue: { $sum: '$finalAmount' } } }
      ]).exec(),
      this.sales.aggregate([
        { $match: { status: { $nin: ['Cancelled', 'Refunded'] } } },
        { $lookup: { from: 'customers', localField: 'customer', foreignField: '_id', as: 'cust' } },
        { $unwind: { path: '$cust', preserveNullAndEmptyArrays: true } },
        { $match: { 'cust.customerSource': { $regex: /online/i } } },
        { $group: { _id: null, count: { $sum: 1 }, revenue: { $sum: '$finalAmount' } } }
      ]).exec(),
    ]);

    const walkInRev = walkInSales[0]?.revenue || 0;
    const walkInDeals = walkInSales[0]?.count || 0;
    const onlineRev = onlineSales[0]?.revenue || 0;
    const onlineDeals = onlineSales[0]?.count || 0;

    return {
      walkIn: {
        totalCustomers: walkInCount,
        bikesSold: walkInDeals,
        totalRevenue: walkInRev,
        avgSpend: walkInDeals > 0 ? Math.round(walkInRev / walkInDeals) : 0,
      },
      online: {
        totalCustomers: onlineCount,
        bikesSold: onlineDeals,
        totalRevenue: onlineRev,
        avgSpend: onlineDeals > 0 ? Math.round(onlineRev / onlineDeals) : 0,
      },
      total: {
        customers: walkInCount + onlineCount,
        bikesSold: walkInDeals + onlineDeals,
        revenue: walkInRev + onlineRev,
      }
    };
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
    const won = rows.filter(row => ['Won', 'Reserved', 'Sold', 'Completed', 'Purchased'].includes(row._id)).reduce((sum, row) => sum + row.count, 0);
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
        const contact = s.customer?.fullName || s.customer?.name || 'Customer';
        const invNum = s.invoiceNumber || s.saleNumber || s._id;
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
        const contact = s.customer?.fullName || s.customer?.name || 'Customer';
        const invNum = s.invoiceNumber || s.saleNumber || s._id;
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
