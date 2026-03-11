import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { Roles } from 'src/users/decorators/user-role.decorator';
import { Role } from 'utils/enum';
import { AuthRolesGuard } from 'src/users/guards/auth-role.guard';

@Controller('api/categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // POST: /api/categories
  @Post()
  @Roles(Role.ADMIN, Role.MANAGER)
  @UseGuards(AuthRolesGuard)
  create(@Body() createProductDto: CreateCategoryDto) {
    return this.categoryService.create(createProductDto);
  }

  // GET: /api/categories
  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.categoryService.findAll();
  }

  // GET: /api/categories/:id
  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.findByCategoryId(id);
  }

  // PATCH: /api/categories/:id
  @Patch(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  @UseGuards(AuthRolesGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateProductDto);
  }

  // DELETE: /api/categories/:id
  @Delete(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  @UseGuards(AuthRolesGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.delete(id);
  }
}
