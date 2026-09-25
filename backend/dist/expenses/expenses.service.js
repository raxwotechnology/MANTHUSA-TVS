"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpensesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let ExpensesService = class ExpensesService {
    expenseModel;
    constructor(expenseModel) {
        this.expenseModel = expenseModel;
    }
    async create(createExpenseDto) {
        const createdExpense = new this.expenseModel(createExpenseDto);
        return createdExpense.save();
    }
    async findAll() {
        return this.expenseModel.find().populate('category').sort({ createdAt: -1 }).exec();
    }
    async findOne(id) {
        const expense = await this.expenseModel.findById(id).populate('category').exec();
        if (!expense) {
            throw new common_1.NotFoundException(`Expense #${id} not found`);
        }
        return expense;
    }
    async update(id, updateExpenseDto) {
        const existingExpense = await this.expenseModel.findByIdAndUpdate(id, updateExpenseDto, { new: true }).exec();
        if (!existingExpense) {
            throw new common_1.NotFoundException(`Expense #${id} not found`);
        }
        return existingExpense;
    }
    async remove(id) {
        const deletedExpense = await this.expenseModel.findByIdAndDelete(id).exec();
        if (!deletedExpense) {
            throw new common_1.NotFoundException(`Expense #${id} not found`);
        }
        return deletedExpense;
    }
};
exports.ExpensesService = ExpensesService;
exports.ExpensesService = ExpensesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Expense')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ExpensesService);
//# sourceMappingURL=expenses.service.js.map