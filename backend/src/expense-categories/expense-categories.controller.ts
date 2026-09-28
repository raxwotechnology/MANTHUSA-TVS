import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ExpenseCategoriesService } from './expense-categories.service';
import { Roles } from '../auth/roles.decorator';

@Controller('expense-categories')
@Roles('Accountant / Finance Staff')
export class ExpenseCategoriesController {
  constructor(private readonly categories: ExpenseCategoriesService) {}
  @Post() create(@Body() body: any) { return this.categories.create(body); }
  @Get() findAll() { return this.categories.findAll(); }
  @Delete(':id') remove(@Param('id') id: string) { return this.categories.remove(id); }
}
