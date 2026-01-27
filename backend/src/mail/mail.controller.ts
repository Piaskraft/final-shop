import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';
import { SendTestMailDto } from './dto/send-test-mail.dto';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('test')
  async test(@Body() dto: SendTestMailDto) {
    const result = await this.mailService.send(dto);
    return { messageId: result.messageId };
  }
}
