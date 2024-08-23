import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class UserQueryModel {
  @IsString()
  @IsOptional()
  sortBy: string = 'createdAt';

  @IsString()
  @IsOptional()
  sortDirection: string = 'desc';

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  pageNumber: number = 1;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  pageSize: number = 10;

  @IsString()
  @IsOptional()
  searchLoginTerm?: string | null = null;

  @IsString()
  @IsOptional()
  searchEmailTerm?: string | null = null;
}
