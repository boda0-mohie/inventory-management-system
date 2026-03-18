import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { StockMovement } from './entities/stock-movement.entity';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { Supplier } from 'src/suppliers/entities/supplier.entity';
import { ProductService } from 'src/products/product.service';
import { UsersService } from 'src/users/users.service';
import { SuppliersService } from 'src/suppliers/suppliers.service';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { MovementType } from 'utils/enum';

@Injectable()
export class StockMovementsService {
  constructor(
    @InjectRepository(StockMovement)
    private readonly stockMovementRepository: Repository<StockMovement>,
    private readonly productService: ProductService,
    private readonly userService: UsersService,
    private readonly suppliersService: SuppliersService,
  ) {}

  /**
   * Create a new stock movement
   * @param createDto create an stock movement (product_id, type, quantity, supplier_id, reference, remarks)
   * @param userId user id
   * @returns stock movement
   */
  async create(createDto: CreateStockMovementDto, userId: string) {
    const { product_id, type, quantity, supplier_id, reference, remarks } =
      createDto;
    const product = await this.productService.findOne(product_id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${product_id} not found`);
    }
    const user = await this.userService.getCurrentUser(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    let supplier: Supplier | undefined;
    if (supplier_id) {
      supplier = await this.suppliersService.findOne(supplier_id);
      if (!supplier) {
        throw new NotFoundException(
          `Supplier with ID ${supplier_id} not found`,
        );
      }
    }
    const previousStock = product.stock;
    let newStock = previousStock;

    if (type === MovementType.IN) {
      newStock += quantity;
    } else if (type === MovementType.OUT) {
      if (previousStock < quantity) {
        throw new BadRequestException(
          `Insufficient stock for product ${product_id}`,
        );
      }

      newStock -= quantity;
    } else if (type === MovementType.ADJUSTMENT) {
      newStock = quantity;
    }

    product.stock = newStock;
    await this.productService.update(product_id, product);

    const stockMovement = this.stockMovementRepository.create({
      product,
      user,
      supplier,
      type,
      quantity,
      previous_stock: previousStock,
      new_stock: newStock,
      reference,
      remarks,
    });

    return await this.stockMovementRepository.save(stockMovement);
  }

  async findAll(product_id?: number, type?: MovementType) {
    const product = product_id ? await this.productService.findOne(product_id) : undefined;
    if(product){
      return await this.stockMovementRepository.find({
        where: {
          product,
          type,
        },
        relations: {
          product: true,
          user: true,
          supplier: true,
        },
      });
    }
    return await this.stockMovementRepository.find({
      where: {
        type,
      },
      relations: {
        product: true,
        user: true,
        supplier: true,
      },
    });
  }
}
