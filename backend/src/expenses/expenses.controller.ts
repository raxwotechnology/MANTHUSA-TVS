import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { Roles } from '../auth/roles.decorator';

@Controller('expenses')
@Roles('Accountant / Finance Staff')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  create(@Body() createExpenseDto: any) {
    return this.expensesService.create(createExpenseDto);
  }

  @Get()
  findAll() {
    return this.expensesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.expensesService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateExpenseDto: any) {
    return this.expensesService.update(id, updateExpenseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.expensesService.remove(id);
  }
}
