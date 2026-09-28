import { Module } from '@nestjs/common';
import { SuppliersController } from './suppliers.controller';
import { SuppliersService } from './suppliers.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SupplierSchema } from './schemas/supplier.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Supplier', schema: SupplierSchema }])],
  controllers: [SuppliersController],
  providers: [SuppliersService]
})
export class SuppliersModule {}
