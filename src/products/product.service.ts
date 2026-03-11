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

  /**
   * Find all products
   * @returns Promise<Product[]>
   */
  public async findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  /**
   * Find products by name
   * @param name 
   * @returns Promise<Product[]>
   */
  public async findByName(name: string): Promise<Product[]> {
    return this.productRepository.find({ where: { name } });
  }

  /**
   * Find one product by id
   * @param id 
   * @returns Promise<Product>
   */
  public async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new BadRequestException('Product not found');
    }
    return product;
  }

  /**
   * Create a new product
   * @param productDto 
   * @returns Promise<Product>
   */
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

  /**
   * Update a product by id
   * @param id 
   * @param productDto 
   * @returns Promise<Product>
   */
  public async update(
    id: number,
    productDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.findOne(id);
    return this.productRepository.save({ ...product, ...productDto });
  }

  /**
   * Delete a product by id
   * @param id 
   * @returns Promise<void>
   */
  public async delete(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }
}
