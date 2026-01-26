-- 0002_add_categories (idempotent)

CREATE TABLE IF NOT EXISTS "Category" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public' AND indexname = 'Category_slug_key'
  ) THEN
    CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");
  END IF;
END $$;

ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "categoryId" INTEGER;

DO $$
BEGIN
  ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey"
    FOREIGN KEY ("categoryId") REFERENCES "Category"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;
