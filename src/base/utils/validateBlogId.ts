import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog } from '../../features/blogs/blog/schemas/Blog.schema';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsBlogIdExistConstraint implements ValidatorConstraintInterface {
  constructor(@InjectModel(Blog.name) private BlogModel: Model<Blog>) {}

  async validate(blogId: any, args: ValidationArguments) {
    const blog = await this.BlogModel.findOne({ _id: blogId }).exec();
    return blog != null;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Blog with ID $value does not exist';
  }
}
