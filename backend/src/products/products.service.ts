import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  private normalizeImageUrl(url: string): string {
    // Fix dla placeholderów i ogólnie URL-i z plusami/spacjami
    // + często bywa interpretowane różnie -> zamieniamy na %20
    return typeof url === 'string' ? url.replace(/\+/g, '%20') : url;
  }

  private normalizeProduct<T extends { images?: Array<{ id: number; url: string }> }>(
    product: T | null,
  ): T | null {
    if (!product) return null;

    if (Array.isArray(product.images)) {
      product.images = product.images.map((img) => ({
        ...img,
        url: this.normalizeImageUrl(img.url),
      }));
    }

    return product;
  }

  private normalizeProducts<T extends { images?: Array<{ id: number; url: string }> }>(
    products: T[],
  ): T[] {
    return products.map((p) => this.normalizeProduct(p) as T);
  }

  async findAll() {
    const products = await this.prisma.product.findMany({
      include: { images: true },
      orderBy: { id: 'asc' },
    });

    return this.normalizeProducts(products);
  }

  async findOneBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: { images: true },
    });

    return this.normalizeProduct(product);
  }
}
