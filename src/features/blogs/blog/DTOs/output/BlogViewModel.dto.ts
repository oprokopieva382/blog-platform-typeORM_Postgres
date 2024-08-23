import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class BlogViewModel {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  websiteUrl: string;

  @IsNotEmpty()
  @IsBoolean()
  isMembership: boolean = false;

  @IsNotEmpty()
  @IsOptional()
  createdAt?: string;
}
