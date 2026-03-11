import { BadRequestException, Injectable } from "@nestjs/common";
import { Category } from "./entities/category.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { Product } from "./entities/product.entity";

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>
    ) {}

    /**
     * Find all categories
     * @returns Promise<Category[]>
     */
    public async findAll(): Promise<Category[]> {
        return this.categoryRepository.find();
    }

    /**
     * Find one category by id
     * @param id 
     * @returns Promise<Category>
     */
    public async findOne(id: number): Promise<Category> {
        const category = await this.categoryRepository.findOne({ where: { id } });
        if (!category) {
            throw new BadRequestException("Category not found");
        }
        return category;
    }

    /**
     * Find products by category id
     * @param category_id 
     * @returns Promise<Product[]>
     */
    public async findByCategoryId(category_id: number): Promise<Product[]> {
        const category = await this.categoryRepository.findOne({ where: { id: category_id } });
        if (!category) {
            throw new BadRequestException('Category not found');
        }
        const products = await this.productRepository.find({
            where: { category: { id: category_id } },
            relations: { category: true }
        });
        return products;
    }

    /**
     * Create a new category
     * @param categoryDto 
     * @returns Promise<Category>
     */
    public async create(categoryDto: CreateCategoryDto): Promise<Category> {
        const { name } = categoryDto;
        const category = this.categoryRepository.create({ name });
        return this.categoryRepository.save(category);
    }

    /**
     * Update a category by id
     * @param id 
     * @param categoryDto 
     * @returns Promise<Category>
     */
    public async update(id: number, categoryDto: UpdateCategoryDto): Promise<Category> {
        const category = await this.categoryRepository.findOne({ where: { id } });
        if (!category) {
            throw new BadRequestException("Category not found");
        }
        return this.categoryRepository.save({ ...category, ...categoryDto });
    }

    /**
     * Delete a category by id
     * @param id 
     * @returns Promise<void>
     */
    public async delete(id: number): Promise<void> {
        const category = await this.categoryRepository.findOne({ where: { id } });
        if (!category) {
            throw new BadRequestException("Category not found");
        }
        await this.categoryRepository.remove(category);
    }
}