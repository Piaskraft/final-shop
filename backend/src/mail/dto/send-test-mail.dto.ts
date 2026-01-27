import { IsEmail, IsString, MinLength } from 'class-validator';

export class SendTestMailDto {
  @IsEmail()
  to!: string;

  @IsString()
  @MinLength(1)
  subject!: string;

  @IsString()
  @MinLength(1)
  text!: string;
}
