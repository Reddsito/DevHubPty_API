import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EventPayloads } from 'src/event-mitter/interface/event-types.interface';

@Injectable()
export class EmailService {

  constructor(
    private readonly mailerService: MailerService
  ){}

  @OnEvent('user.verifyEmail')
  async verifyEmail(data: EventPayloads['user.verifyEmail']) {

    const { email, name, link } = data;
    const subject = `Welcome to Devhub: ${name}`;

    try {
      await this.mailerService.sendMail({
        to: email,
        subject,
        template: './verify-email',
        context: {
          name,
          link
        },
      });

    } catch( error ) {
      console.log(error)
    }
    
  }

  @OnEvent('user.forgotPassword')
  async forgotPassword(data: EventPayloads['user.forgotPassword']) {

    const { email, name, link } = data;
    const subject = `Welcome to Devhub: ${name}`;

    try {
      await this.mailerService.sendMail({
        to: email,
        subject,
        template: './forgot-password',
        context: {
          name,
          link
        },
      });

    } catch( error ) {
      console.log(error)
    }
    
  }

  @OnEvent('user.changePassword')
  async changePassword(data: EventPayloads['user.changePassword']) {

    const { email, name, link } = data;
    const subject = `Welcome to Devhub: ${name}`;

    try {
      await this.mailerService.sendMail({
        to: email,
        subject,
        template: './change-password',
        context: {
          name,
          link
        },
      });

    } catch( error ) {
      console.log(error)
    }
    
  }

}
