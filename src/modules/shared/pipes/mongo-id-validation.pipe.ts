import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class MongoIdValidationPipe implements PipeTransform<string> {
  transform(value: string, metadata: ArgumentMetadata): string {
    const isValidObjectId = Types.ObjectId.isValid(value);
    if (!isValidObjectId) {
      throw new BadRequestException('Invalid ObjectId');
    }
    return value;
  }
}