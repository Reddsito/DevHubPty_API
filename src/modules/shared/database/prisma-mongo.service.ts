
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma-mongo/prisma/client';

@Injectable()
export class PrismaMongoService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}