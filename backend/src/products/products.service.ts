import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.product.findMany({
      include: { images: true },
      orderBy: { id: 'desc' },
    });
  }

  async findOneBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: { images: true },
    });

    if (!product) {
      throw new NotFoundException(`Product slug="${slug}" nie istnieje.`);
    }

    return product;
  }

  async getById(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!product) {
      throw new NotFoundException(`Product id=${id} nie istnieje.`);
    }

    return product;
  }

  create(dto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        price: dto.price,
        description: dto.description ?? '',
        mainImage: dto.mainImage,
      },
      include: { images: true },
    });
  }

  update(id: number, dto: UpdateProductDto) {
    return this.prisma.product.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.slug !== undefined ? { slug: dto.slug } : {}),
        ...(dto.price !== undefined ? { price: dto.price } : {}),
        ...(dto.description !== undefined
          ? { description: dto.description ?? '' }
          : {}),
      },
      include: { images: true },
    });
  }

  remove(id: number) {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
