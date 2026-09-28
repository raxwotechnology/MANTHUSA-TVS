import { Module } from '@nestjs/common';
import { ExpenseCategoriesController } from './expense-categories.controller';
import { ExpenseCategoriesService } from './expense-categories.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ExpenseCategorySchema } from './schemas/expense-category.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'ExpenseCategory', schema: ExpenseCategorySchema }])],
  controllers: [ExpenseCategoriesController],
  providers: [ExpenseCategoriesService]
})
export class ExpenseCategoriesModule {}
