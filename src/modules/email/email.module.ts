import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';



@Module({
  controllers: [EmailController],
  providers: [EmailService],
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('nodemailer.host'),
          port: configService.get<number>('nodemailer.port'),
          secure: false,
          auth: {
            user: configService.get<string>('nodemailer.user'),
            pass: configService.get<string>('nodemailer.password'),
          },
        },
        defaults: {
          from: `"From ${configService.get<string>('nodemailer.user')}`,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new EjsAdapter(),
          options: {
            strict: true,
          },
        },
      })
    })
  ]
})
export class EmailModule { }
