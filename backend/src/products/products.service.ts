import { Injectable } from '@nestjs/common';
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

  findOneBySlug(slug: string) {
    return this.prisma.product.findUnique({
      where: { slug },
      include: { images: true },
    });
  }

  getById(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
      include: { images: true },
    });
  }

  create(dto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        price: dto.price,
        description: dto.description ?? '',
        mainImage: dto.mainImage,
 // REQUIRED in Prisma schema
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
        ...(dto.description !== undefined ? { description: dto.description ?? '' } : {}),
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
