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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get('id/:id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    const category = await this.categoriesService.getById(id);
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  @Get('slug/:slug')
  async getBySlug(@Param('slug') slug: string) {
    const category = await this.categoriesService.getBySlug(slug);
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  @Post()
  create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  @Patch('id/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoryDto,
  ) {
    const exists = await this.categoriesService.getById(id);
    if (!exists) throw new NotFoundException('Category not found');
    return this.categoriesService.update(id, dto);
  }

  @Delete('id/:id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    const exists = await this.categoriesService.getById(id);
    if (!exists) throw new NotFoundException('Category not found');
    return this.categoriesService.delete(id);
  }
}
