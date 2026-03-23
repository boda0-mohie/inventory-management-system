import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchasesController } from './purchases.controller';
import { PurchasesService } from './purchases.service';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { PurchaseItem } from './entities/purchase-item.entity';
import { StockMovementsModule } from 'src/stock_movements/stock_movements.module';
import { ProductModule } from 'src/products/product.module';
import { SuppliersModule } from 'src/suppliers/suppliers.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PurchaseOrder, PurchaseItem]),
    StockMovementsModule,
    ProductModule,
    SuppliersModule,
    UsersModule,
  ],
  controllers: [PurchasesController],
  providers: [PurchasesService],
  exports: [PurchasesService],
})
export class PurchasesModule {}
