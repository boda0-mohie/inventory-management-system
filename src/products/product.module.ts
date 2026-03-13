import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';
import { Category } from './entities/category.entity';
import { CategoryService } from './category.service';
import { UsersModule } from 'src/users/users.module';
import { ProductController } from './product.controller';
import { CategoryController } from './category.controller';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Product, Category])],
  providers: [ProductService, CategoryService],
  controllers: [ProductController, CategoryController],
  exports: [ProductService, CategoryService],
})
export class ProductModule {}
