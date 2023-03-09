import { Injectable } from '@nestjs/common/decorators';
import { createTransport } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { SmtpConfig } from 'src/configuration';

@Injectable()
export default class EmailService {
  private nodeemailerTransport: Mail;

  constructor(private readonly smtpConfig: SmtpConfig) {
    this.nodeemailerTransport = createTransport({
      host: this.smtpConfig.host,
      secure: true,
      auth: {
        user: this.smtpConfig.user,
        pass: this.smtpConfig.password,
      },
    });
  }

  public async sendMail(options: Mail.Options): Promise<void> {
    await this.nodeemailerTransport.sendMail(options);
    return;
  }
}
