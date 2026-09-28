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
exports.ExpenseCategoriesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let ExpenseCategoriesService = class ExpenseCategoriesService {
    model;
    constructor(model) {
        this.model = model;
    }
    async create(input) { return this.model.findOneAndUpdate({ name: input.name }, { $set: input }, { upsert: true, new: true, runValidators: true }).exec(); }
    findAll() { return this.model.find().sort({ name: 1 }).exec(); }
    async remove(id) {
        const item = await this.model.findByIdAndDelete(id).exec();
        if (!item)
            throw new common_1.NotFoundException(`Expense category ${id} not found.`);
        return item;
    }
};
exports.ExpenseCategoriesService = ExpenseCategoriesService;
exports.ExpenseCategoriesService = ExpenseCategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('ExpenseCategory')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ExpenseCategoriesService);
//# sourceMappingURL=expense-categories.service.js.map