import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { FilterPurchasesDto } from './dto/filter-purchases.dto';
import { AuthGuard } from 'src/users/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('purchases')
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @Post()
  create(@Body() createDto: CreatePurchaseDto, @Req() req: any) {
    return this.purchasesService.create(createDto, req.user.id);
  }

  @Get()
  findAll(@Query() filterDto: FilterPurchasesDto) {
    return this.purchasesService.findAll(filterDto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.purchasesService.findOne(id);
  }

  @Patch(':id/complete')
  complete(@Param('id') id: number, @Req() req: any) {
    return this.purchasesService.complete(id, req.user.id);
  }

  @Patch(':id/cancel')
  cancel(@Param('id') id: number) {
    return this.purchasesService.cancel(id);
  }
}
