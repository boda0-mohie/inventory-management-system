import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { MovementType } from 'utils/enum';

export class CreateStockMovementDto {
  @ApiProperty({ description: 'The ID of the product' })
  @IsNotEmpty()
  @IsNumber()
  product_id: number;

  @ApiProperty({ description: 'The type of movement: IN, OUT, or ADJUSTMENT' })
  @IsNotEmpty()
  @IsEnum(MovementType)
  type: MovementType;

  @ApiProperty({ description: 'The quantity of the movement' })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiPropertyOptional({ description: 'Optional supplier ID for IN movements' })
  @IsOptional()
  @IsNumber()
  supplier_id?: number;

  @ApiPropertyOptional({ description: 'Optional reference number (e.g., PO)' })
  @IsOptional()
  @IsString()
  reference?: string;

  @ApiPropertyOptional({ description: 'Optional remarks or notes' })
  @IsOptional()
  @IsString()
  remarks?: string;
}
