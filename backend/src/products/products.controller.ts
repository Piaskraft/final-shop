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
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // ✅ pod e2e: /products/123 -> ParseIntPipe działa, /products/abc -> 400
  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.getById(id);
  }

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  // ✅ slug przeniesiony, żeby nie kolidował z :id
  @Get('slug/:slug')
  async findOne(@Param('slug') slug: string) {
    const product = await this.productsService.findOneBySlug(slug);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }
}
