import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { Types } from 'mongoose';

export function IsMongoId(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isMongoId',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const isValidObjectId = Types.ObjectId.isValid(value);
          return isValidObjectId;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid ObjectId`;
        }
      }
    });
  };
}
