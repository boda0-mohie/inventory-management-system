import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockMovementsService } from './stock_movements.service';
import { StockMovementsController } from './stock_movements.controller';
import { StockMovement } from './entities/stock-movement.entity';
import { Product } from 'src/products/entities/product.entity';
import { UsersModule } from 'src/users/users.module';
import { ProductModule } from 'src/products/product.module';
import { JwtModule } from '@nestjs/jwt';
import { SuppliersModule } from 'src/suppliers/suppliers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StockMovement, Product]),
    UsersModule,
    ProductModule,
    SuppliersModule,
    JwtModule
  ],
  controllers: [StockMovementsController],
  providers: [StockMovementsService],
})
export class StockMovementsModule {}
