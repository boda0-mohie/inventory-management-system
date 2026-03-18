import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { StockMovementsService } from './stock_movements.service';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { Roles } from 'src/users/decorators/user-role.decorator';
import { Role, MovementType } from 'utils/enum';
import { AuthRolesGuard } from 'src/users/guards/auth-role.guard';

@ApiTags('Stock Movements')
@ApiBearerAuth()
@Controller('api/stock-movements')
@UseGuards(AuthGuard)
export class StockMovementsController {
  constructor(private readonly stockMovementsService: StockMovementsService) {}

  // POST: api/stock-movements
  @Post()
  @Roles(Role.ADMIN, Role.MANAGER, Role.STAFF)
  @UseGuards(AuthRolesGuard)
  @ApiOperation({ summary: 'Create a new stock movement' })
  @ApiResponse({ status: 201, description: 'Stock movement successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request (e.g. insufficient stock).' })
  create(@Body() createStockMovementDto: CreateStockMovementDto, @Request() req) {
    const userId = req.user.id;
    return this.stockMovementsService.create(createStockMovementDto, userId);
  }

  // GET: api/stock-movements
  @Get()
  @ApiOperation({ summary: 'Get a list of stock movements' })
  @ApiResponse({ status: 200, description: 'Returns all matching stock movements.' })
  @ApiQuery({ name: 'product_id', required: false, type: Number })
  @ApiQuery({ name: 'type', required: false, enum: MovementType })
  findAll(
    @Query('product_id') product_id?: number,
    @Query('type') type?: MovementType,
  ) {
    return this.stockMovementsService.findAll(product_id, type);
  }
}
