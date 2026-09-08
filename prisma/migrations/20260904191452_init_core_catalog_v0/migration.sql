-- CreateEnum
CREATE TYPE "public"."stock_status_enum" AS ENUM ('IN_STOCK', 'OUT_OF_STOCK', 'UNKNOWN');

-- CreateTable
CREATE TABLE "public"."brand" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "source_brand_id" TEXT,
    "name" TEXT NOT NULL,
    "slug" TEXT,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."family" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "source_family_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "family_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."subfamily" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "source_subfamily_id" TEXT NOT NULL,
    "family_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "subfamily_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."product_range" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "brand_id" UUID,
    "name" TEXT NOT NULL,
    "slug" TEXT,
    "description" TEXT,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "product_range_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."product" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "erp_code" TEXT NOT NULL,
    "erp_name" TEXT NOT NULL,
    "commerce_name" TEXT,
    "slug" TEXT,
    "brand_id" UUID,
    "family_id" UUID,
    "subfamily_id" UUID,
    "range_id" UUID,
    "short_description" TEXT,
    "long_description" TEXT,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "price" DECIMAL(12,2),
    "vat_rate" DECIMAL(5,2),
    "price_synced_at" TIMESTAMP(3),
    "stock_quantity" DECIMAL(14,3),
    "stock_status" "public"."stock_status_enum",
    "stock_synced_at" TIMESTAMP(3),
    "imported_from_dw_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."product_image" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "product_id" UUID,
    "range_id" UUID,
    "storage_key" TEXT NOT NULL,
    "source" TEXT,
    "source_reference" TEXT,
    "alt_text" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3),

    CONSTRAINT "product_image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "brand_source_brand_id_key" ON "public"."brand"("source_brand_id");

-- CreateIndex
CREATE UNIQUE INDEX "brand_slug_key" ON "public"."brand"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "family_source_family_id_key" ON "public"."family"("source_family_id");

-- CreateIndex
CREATE UNIQUE INDEX "subfamily_source_subfamily_id_key" ON "public"."subfamily"("source_subfamily_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_range_slug_key" ON "public"."product_range"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "product_erp_code_key" ON "public"."product"("erp_code");

-- CreateIndex
CREATE UNIQUE INDEX "product_slug_key" ON "public"."product"("slug");

-- AddForeignKey
ALTER TABLE "public"."subfamily" ADD CONSTRAINT "subfamily_family_id_fkey" FOREIGN KEY ("family_id") REFERENCES "public"."family"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_range" ADD CONSTRAINT "product_range_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "public"."brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product" ADD CONSTRAINT "product_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "public"."brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product" ADD CONSTRAINT "product_family_id_fkey" FOREIGN KEY ("family_id") REFERENCES "public"."family"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product" ADD CONSTRAINT "product_subfamily_id_fkey" FOREIGN KEY ("subfamily_id") REFERENCES "public"."subfamily"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product" ADD CONSTRAINT "product_range_id_fkey" FOREIGN KEY ("range_id") REFERENCES "public"."product_range"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_image" ADD CONSTRAINT "product_image_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_image" ADD CONSTRAINT "product_image_range_id_fkey" FOREIGN KEY ("range_id") REFERENCES "public"."product_range"("id") ON DELETE SET NULL ON UPDATE CASCADE;
