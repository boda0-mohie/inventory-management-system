import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { PurchaseStatus } from 'utils/enum';

export class FilterPurchasesDto {
  @IsOptional()
  @IsEnum(PurchaseStatus)
  status?: PurchaseStatus;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  supplier_id?: number;
}
