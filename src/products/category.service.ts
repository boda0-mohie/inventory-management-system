import { BadRequestException, Injectable } from "@nestjs/common";
import { Category } from "./entities/category.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>
    ) {}

    public async findAll(): Promise<Category[]> {
        return this.categoryRepository.find();
    }

    public async findOne(id: number): Promise<Category> {
        const category = await this.categoryRepository.findOne({ where: { id } });
        if (!category) {
            throw new BadRequestException("Category not found");
        }
        return category;
    }

    public async create(categoryDto: CreateCategoryDto): Promise<Category> {
        const { name } = categoryDto;
        const category = this.categoryRepository.create({ name });
        return this.categoryRepository.save(category);
    }

    public async update(id: number, categoryDto: UpdateCategoryDto): Promise<Category> {
        const category = await this.categoryRepository.findOne({ where: { id } });
        if (!category) {
            throw new BadRequestException("Category not found");
        }
        return this.categoryRepository.save({ ...category, ...categoryDto });
    }

    public async delete(id: number): Promise<void> {
        const category = await this.categoryRepository.findOne({ where: { id } });
        if (!category) {
            throw new BadRequestException("Category not found");
        }
        await this.categoryRepository.remove(category);
    }
}