import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { Roles } from 'src/users/decorators/user-role.decorator';
import { Role } from 'utils/enum';
import { AuthRolesGuard } from 'src/users/guards/auth-role.guard';

@Controller('api/products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // POST: /api/products 
  @Post()
  @Roles(Role.ADMIN, Role.MANAGER)
  @UseGuards(AuthRolesGuard)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  // GET: /api/products
  @Get()
  @UseGuards(AuthGuard)
  findAll(
    @Query('category_id') category_id?: number,
    @Query('name') name?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
  ) {
    return this.productService.getAll(category_id, name, minPrice, maxPrice);
  }

  // GET: /api/products/:id
  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }
  
  // PATCH: /api/products/:id
  @Patch(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  @UseGuards(AuthRolesGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(id, updateProductDto);
  }

  // DELETE: /api/products/:id
  @Delete(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  @UseGuards(AuthRolesGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productService.delete(id);
  }
}
