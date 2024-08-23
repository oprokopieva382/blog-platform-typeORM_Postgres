import { OmitType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsInt,  IsOptional, IsString } from 'class-validator';

export class BlogQueryModel {
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
  searchNameTerm?: string | null = null;
}

export class BlogPostQueryModel extends OmitType(BlogQueryModel, [
  'searchNameTerm',
] as const) {}
