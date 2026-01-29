-- Add slug column, backfill, then enforce constraints
ALTER TABLE "Tenant" ADD COLUMN "slug" TEXT;

UPDATE "Tenant"
SET "slug" = lower(regexp_replace("name", '\\s+', '-', 'g'))
WHERE "slug" IS NULL;

ALTER TABLE "Tenant" ALTER COLUMN "slug" SET NOT NULL;

CREATE UNIQUE INDEX "Tenant_slug_key" ON "Tenant"("slug");
