// backend/prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = [
    {
      name: 'MJW Ringmaulschlüssel 10 mm',
      slug: 'mjw-ringmaulschluessel-10mm',
      description:
        'Stabiler Ring-Maulschlüssel 10 mm aus Chrom-Vanadium-Stahl, ideal für Werkstatt und Hobby.',
      price: 6.49,
      mainImage:
        'https://via.placeholder.com/600x400?text=Ringmaulschluessel+10mm',
      images: [
        'https://via.placeholder.com/600x400?text=Ringmaulschluessel+10mm+1',
        'https://via.placeholder.com/600x400?text=Ringmaulschluessel+10mm+2',
      ],
    },
    {
      name: 'MJW Ringmaulschlüssel 17 mm',
      slug: 'mjw-ringmaulschluessel-17mm',
      description:
        'Beliebter Ring-Maulschlüssel 17 mm – perfekt für Radmuttern und KFZ-Arbeiten.',
      price: 7.99,
      mainImage:
        'https://via.placeholder.com/600x400?text=Ringmaulschluessel+17mm',
      images: [
        'https://via.placeholder.com/600x400?text=Ringmaulschluessel+17mm+1',
      ],
    },
    {
      name: 'MJW Steckschlüssel-Set 1/2" 10–24 mm, 12-tlg.',
      slug: 'mjw-steckschluessel-set-1-2-10-24mm-12tlg',
      description:
        'Steckschlüssel-Satz 1/2" von 10 bis 24 mm, 12-tlg., robuste CrV-Ausführung im praktischen Halter.',
      price: 79.9,
      mainImage:
        'https://via.placeholder.com/600x400?text=Steckschluessel+Set+1-2',
      images: [
        'https://via.placeholder.com/600x400?text=Steckschluessel+Set+1-2+1',
        'https://via.placeholder.com/600x400?text=Steckschluessel+Set+1-2+2',
      ],
    },
    {
      name: 'MJW Werkzeugwagen leer, 7 Schubladen',
      slug: 'mjw-werkzeugwagen-7-schubladen-leer',
      description:
        'Werkzeugwagen mit 7 kugelgelagerten Schubladen, vorbereitet für MJW-Steckschlüssel und Schlüssel-Sätze.',
      price: 249.0,
      mainImage:
        'https://via.placeholder.com/600x400?text=Werkzeugwagen+7+Schubladen',
      images: [
        'https://via.placeholder.com/600x400?text=Werkzeugwagen+Detail+1',
      ],
    },
  ];

  for (const product of products) {
    const { images, ...productData } = product;

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        ...productData,
        images: {
          create: images.map((url) => ({ url })),
        },
      },
    });
  }

  console.log('Seed finished ✅');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
