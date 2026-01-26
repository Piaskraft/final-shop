import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('id/:id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.getById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Patch('id/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ) {
    const user = await this.usersService.getById(id);
    if (!user) throw new NotFoundException('User not found');
    return this.usersService.update(id, dto);
  }

  @Delete('id/:id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.getById(id);
    if (!user) throw new NotFoundException('User not found');
    return this.usersService.remove(id);
  }
}
