import { IsOptional, IsString } from 'class-validator';

export class UpdateOrderDto {
  @IsOptional()
  @IsString()
  status?: 'pending' | 'completed' | 'cancelled';
}
