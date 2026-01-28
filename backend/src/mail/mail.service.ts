import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

type MailSendResult = { messageId: string };
type MailInfo = SMTPTransport.SentMessageInfo;

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  // 🔥 klucz: transporter jest typowany jako MailInfo, a nie any
  private readonly transporter: nodemailer.Transporter<MailInfo> | null;

  constructor() {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT ?? 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
      this.logger.warn(
        'SMTP is not configured (SMTP_HOST/SMTP_USER/SMTP_PASS). Mails disabled.',
      );
      this.transporter = null;
      return;
    }

    // 🔥 klucz: createTransport<MailInfo>()
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    } as SMTPTransport.Options);
  }

  async send(params: {
    to: string;
    subject: string;
    text: string;
  }): Promise<MailSendResult> {
    if (!this.transporter) {
      throw new ServiceUnavailableException('Email is not configured');
    }

    const from = process.env.SMTP_FROM ?? process.env.SMTP_USER!;

    const info = await this.transporter.sendMail({
      from,
      ...params,
    });

    // MailInfo.messageId jest string → zero any
    return { messageId: info.messageId };
  }
}
