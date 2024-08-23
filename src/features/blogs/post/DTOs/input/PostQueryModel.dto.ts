import { OmitType } from '@nestjs/mapped-types';
import { BlogQueryModel } from 'src/features/blogs/blog/DTOs/input/BlogQueryModel.dto';

export class PostQueryModel extends OmitType(BlogQueryModel, [
  'searchNameTerm',
] as const) {}
