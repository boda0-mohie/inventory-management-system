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
  findAll() {
    return this.productService.findAll();
  }

  // GET: /api/products/:id
  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  // GET: /api/products/:name
  @Get(':name')
  @UseGuards(AuthGuard)
  findByName(@Param('name') name: string) {
    return this.productService.findByName(name);
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
