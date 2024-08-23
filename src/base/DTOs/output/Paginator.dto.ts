import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class PaginatorModel<T> {
  @IsNumber()
  @IsOptional()
  pagesCount?: number;

  @IsNumber()
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsOptional()
  pageSize?: number;

  @IsNumber()
  @IsOptional()
  totalCount?: number;

  @IsNotEmpty()
  items: T[];
}
