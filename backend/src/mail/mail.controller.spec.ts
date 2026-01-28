import { Test } from '@nestjs/testing';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';

describe('MailController', () => {
  let controller: MailController;

  const sendMock: jest.MockedFunction<MailService['send']> = jest.fn();

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      controllers: [MailController],
      providers: [{ provide: MailService, useValue: { send: sendMock } }],
    }).compile();

    controller = moduleRef.get<MailController>(MailController);
  });

  it('test(): calls MailService.send and returns messageId', async () => {
    sendMock.mockResolvedValue({ messageId: 'm_1' });

    const result = await controller.test({
      to: 'x@y.com',
      subject: 'S',
      text: 'T',
    });

    expect(sendMock).toHaveBeenCalledWith({
      to: 'x@y.com',
      subject: 'S',
      text: 'T',
    });

    expect(result).toEqual({ messageId: 'm_1' });
  });
});
