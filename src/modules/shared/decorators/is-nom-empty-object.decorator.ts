import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsNonEmptyObject(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'isNonEmptyObject',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!value || typeof value !== 'object' || Array.isArray(value)) {
            return false;
          }
          return Object.keys(value).length > 0;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a non-empty object`;
        }
      }
    });
  };
}
