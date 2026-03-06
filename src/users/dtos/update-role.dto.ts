import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Role } from 'utils/enum';

export class UpdateRoleDto {
  @ApiProperty({ enum: Role, example: Role.MANAGER })
  @IsEnum(Role)
  role: Role;
}