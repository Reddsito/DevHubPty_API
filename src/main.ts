import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import * as cookieParser from'cookie-parser'
import { ResponseInterceptor } from './modules/shared/interceptors/response.interceptor';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigVariables } from '@/configuration/configuration';

async function bootstrap() {
  const config = ConfigVariables();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(cookieParser());


  app.setGlobalPrefix('api/v1/')
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalInterceptors( new ResponseInterceptor )
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  await app.listen(config.port)
}
bootstrap();
