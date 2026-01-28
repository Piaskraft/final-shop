import { ServiceUnavailableException } from '@nestjs/common';
import nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import { MailModule } from './mail.module';
import { MailService } from './mail.service';

type MailInfo = SMTPTransport.SentMessageInfo;
type CreateTransport = (
  options: SMTPTransport.Options,
) => nodemailer.Transporter<MailInfo>;

const sendMailMock: jest.MockedFunction<
  (options: nodemailer.SendMailOptions) => Promise<MailInfo>
> = jest.fn();

const createTransportMock: jest.MockedFunction<CreateTransport> = jest.fn();

jest.mock('nodemailer', () => ({
  __esModule: true,
  default: {
    createTransport: (options: SMTPTransport.Options) =>
      createTransportMock(options),
  },
}));

describe('MailService', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...OLD_ENV };

    delete process.env.SMTP_HOST;
    delete process.env.SMTP_PORT;
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASS;
    delete process.env.SMTP_FROM;
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('MailModule exists (coverage for module file)', () => {
    expect(MailModule).toBeDefined();
  });

  it('throws ServiceUnavailableException when SMTP env is missing', async () => {
    const service = new MailService();

    await expect(
      service.send({ to: 'a@b.com', subject: 'Hi', text: 'Test' }),
    ).rejects.toBeInstanceOf(ServiceUnavailableException);

    expect(createTransportMock).not.toHaveBeenCalled();
  });

  it('creates transporter and sends mail when env is present', async () => {
    process.env.SMTP_HOST = 'smtp.example.com';
    process.env.SMTP_PORT = '587';
    process.env.SMTP_USER = 'user';
    process.env.SMTP_PASS = 'pass';
    process.env.SMTP_FROM = 'no-reply@example.com';

    const transporterMock = {
      sendMail: sendMailMock,
    } as unknown as nodemailer.Transporter<MailInfo>;

    createTransportMock.mockReturnValue(transporterMock);

    sendMailMock.mockResolvedValue({ messageId: 'msg_1' } as MailInfo);

    const service = new MailService();
    const result = await service.send({
      to: 'test@example.com',
      subject: 'Hello',
      text: 'World',
    });

    expect(createTransportMock).toHaveBeenCalledWith({
      host: 'smtp.example.com',
      port: 587,
      secure: false,
      auth: { user: 'user', pass: 'pass' },
    });

    expect(sendMailMock).toHaveBeenCalledWith({
      from: 'no-reply@example.com',
      to: 'test@example.com',
      subject: 'Hello',
      text: 'World',
    });

    expect(result).toEqual({ messageId: 'msg_1' });
  });
});
