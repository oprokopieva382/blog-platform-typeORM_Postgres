import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsBlogIdExistConstraint } from '../utils/validateBlogId';

export const IsBlogIdExist = (validationOptions?: ValidationOptions) => {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsBlogIdExistConstraint,
    });
  };
};
