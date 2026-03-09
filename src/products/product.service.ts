import { BadRequestException, Injectable } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CategoryService } from './category.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly categoryService: CategoryService,
  ) {}

  public async findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  public async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new BadRequestException('Product not found');
    }
    return product;
  }

  public async create(productDto: CreateProductDto): Promise<Product> {
    const {
      name,
      description,
      price,
      stock,
      category_id,
      low_stock_threshold,
    } = productDto;
    const category = await this.categoryService.findOne(category_id);
    if (!category) {
      throw new BadRequestException('Category not found');
    }
    const product = this.productRepository.create({
      name,
      description,
      price,
      stock,
      category: { id: category_id },
      low_stock_threshold,
    });
    return this.productRepository.save(product);
  }

  public async update(
    id: number,
    productDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.findOne(id);
    return this.productRepository.save({ ...product, ...productDto });
  }

  public async delete(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }
}
