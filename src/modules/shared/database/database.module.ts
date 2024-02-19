import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaMongoService } from './prisma-mongo.service';

@Module({
  providers: [PrismaService, PrismaMongoService],
  exports: [PrismaService, PrismaMongoService]
})
export class DatabaseModule {}
