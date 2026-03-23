import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsDecimal, IsInt, IsNotEmpty, IsNumber, Min, ValidateNested } from 'class-validator';

export class PurchaseItemDto {
  @IsInt()
  @IsNotEmpty()
  product_id: number;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  price: number;
}

export class CreatePurchaseDto {
  @IsInt()
  @IsNotEmpty()
  supplier_id: number;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => PurchaseItemDto)
  items: PurchaseItemDto[];
}
