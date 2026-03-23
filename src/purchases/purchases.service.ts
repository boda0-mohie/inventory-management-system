import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { PurchaseItem } from './entities/purchase-item.entity';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { FilterPurchasesDto } from './dto/filter-purchases.dto';
import { SuppliersService } from 'src/suppliers/suppliers.service';
import { ProductService } from 'src/products/product.service';
import { UsersService } from 'src/users/users.service';
import { StockMovementsService } from 'src/stock_movements/stock_movements.service';
import { PurchaseStatus, MovementType } from 'utils/enum';

@Injectable()
export class PurchasesService {
  constructor(
    @InjectRepository(PurchaseOrder)
    private readonly purchaseOrderRepository: Repository<PurchaseOrder>,
    @InjectRepository(PurchaseItem)
    private readonly purchaseItemRepository: Repository<PurchaseItem>,
    private readonly suppliersService: SuppliersService,
    private readonly productService: ProductService,
    private readonly usersService: UsersService,
    private readonly stockMovementsService: StockMovementsService,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Create a new purchase order
   * @param createDto 
   * @param userId 
   * @returns 
   */
  public async create(createDto: CreatePurchaseDto, userId: string) {
    const user = await this.usersService.getCurrentUser(userId);
    if (!user) throw new NotFoundException('User not found');

    const supplier = await this.suppliersService.findOne(createDto.supplier_id);
    if (!supplier) throw new NotFoundException('Supplier not found');

    let total_price = 0;
    const purchaseItems: PurchaseItem[] = [];

    for (const itemDto of createDto.items) {
      const product = await this.productService.findOne(itemDto.product_id);
      if (!product) {
        throw new NotFoundException(`Product with ID ${itemDto.product_id} not found`);
      }

      const purchaseItem = this.purchaseItemRepository.create({
        product,
        quantity: itemDto.quantity,
        price: itemDto.price,
      });

      total_price += Number(itemDto.price) * itemDto.quantity;
      purchaseItems.push(purchaseItem);
    }

    const purchaseOrder = this.purchaseOrderRepository.create({
      supplier,
      created_by: user,
      total_price,
      items: purchaseItems,
    });

    return await this.purchaseOrderRepository.save(purchaseOrder);
  }

  /**
   * Find all purchases
   * @param filterDto 
   * @returns 
   */
  async findAll(filterDto: FilterPurchasesDto) {
    const allPurchases = await this.purchaseOrderRepository.find({
      relations: ['supplier', 'items', 'items.product', 'created_by'],
    });

    if (filterDto.status) {
      return allPurchases.filter((po) => po.status === filterDto.status);
    }

    if (filterDto.supplier_id) {
      return allPurchases.filter((po) => po.supplier.id === filterDto.supplier_id);
    }

    return allPurchases;
  }

  /**
   * Find a purchase order by ID
   * @param id 
   * @returns 
   */
  async findOne(id: number) {
    const po = await this.purchaseOrderRepository.findOne({
      where: { id },
      relations: ['supplier', 'items', 'items.product', 'created_by'],
    });

    if (!po) throw new NotFoundException(`PurchaseOrder with ID ${id} not found`);
    return po;
  }

  /**
   * Complete a purchase order
   * @param id 
   * @param userId 
   * @returns 
   */
  async complete(id: number, userId: string) {
    const purchase = await this.findOne(id);
    
    if (purchase.status === PurchaseStatus.COMPLETED) {
      throw new BadRequestException('Purchase order is already completed');
    }
    
    if (purchase.status === PurchaseStatus.CANCELLED) {
      throw new BadRequestException('Cannot complete a cancelled purchase order');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      purchase.status = PurchaseStatus.COMPLETED;
      await queryRunner.manager.save(purchase);

      for (const item of purchase.items) {
        await this.stockMovementsService.create({
          type: MovementType.IN,
          quantity: item.quantity,
          product_id: item.product.id,
          supplier_id: purchase.supplier.id,
          reference: `PO-${purchase.id}`,
          remarks: 'Purchase Order Completion',
        }, userId);
      }

      await queryRunner.commitTransaction();
      return purchase;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async cancel(id: number) {
    const po = await this.findOne(id);

    if (po.status === PurchaseStatus.COMPLETED) {
      throw new BadRequestException('Cannot cancel a completed purchase order');
    }

    po.status = PurchaseStatus.CANCELLED;
    return await this.purchaseOrderRepository.save(po);
  }
}
