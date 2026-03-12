import { BadRequestException, Injectable } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Like, Repository } from 'typeorm';
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
   * Return All Products For Data Store
   * @param category_id 
   * @param name 
   * @param minPrice 
   * @param maxPrice 
   * @returns 
   */
  public getAll(category_id?: number, name?: string, minPrice?: string, maxPrice?: string) {
    const filters = {
      ...(category_id ? { category: { id: category_id } } : {}),
      ...(name ? { name: Like(`%${name}%`) } : {}),
      ...(minPrice && maxPrice ? { price: Between(+minPrice, +maxPrice) } : {}),
    };

    return this.productRepository.find({
      where: filters,
      relations: { category: true },
    });
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
