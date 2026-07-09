-- DropIndex
DROP INDEX "website_url_key";

-- AlterTable
ALTER TABLE "websiteTick" ADD COLUMN     "isTempTick" BOOLEAN NOT NULL DEFAULT false;
