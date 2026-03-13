import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { Roles } from 'src/users/decorators/user-role.decorator';
import { Role } from 'utils/enum';
import { AuthRolesGuard } from 'src/users/guards/auth-role.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import * as types from 'utils/type';

@Controller('api/suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  // POST /api/suppliers
  @Post()
  @Roles(Role.ADMIN, Role.MANAGER)
  @UseGuards(AuthRolesGuard)
  create(
    @Body() createSupplierDto: CreateSupplierDto,
    @CurrentUser() payload: types.JWTPayloadType,
  ) {
    return this.suppliersService.create(createSupplierDto, payload.sub);
  }

  // GET /api/suppliers
  @Get()
  @Roles(Role.ADMIN, Role.MANAGER)
  @UseGuards(AuthRolesGuard)
  findAll() {
    return this.suppliersService.findAll();
  }

  // GET /api/suppliers/:id
  @Get(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  @UseGuards(AuthRolesGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.suppliersService.findOne(id);
  }

  // PATCH /api/suppliers/:id
  @Patch(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  @UseGuards(AuthRolesGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSupplierDto: UpdateSupplierDto,
  ) {
    return this.suppliersService.update(id, updateSupplierDto);
  }

  // DELETE /api/suppliers/:id
  @Delete(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  @UseGuards(AuthRolesGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.suppliersService.remove(id);
  }
}
