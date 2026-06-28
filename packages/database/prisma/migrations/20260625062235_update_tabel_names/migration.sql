/*
  Warnings:

  - You are about to drop the `Region` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `status` on the `websiteTick` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "websiteStatus" AS ENUM ('UP', 'DOWN', 'Unknown');

-- DropForeignKey
ALTER TABLE "websiteTick" DROP CONSTRAINT "websiteTick_regionId_fkey";

-- AlterTable
ALTER TABLE "websiteTick" DROP COLUMN "status",
ADD COLUMN     "status" "websiteStatus" NOT NULL;

-- DropTable
DROP TABLE "Region";

-- DropEnum
DROP TYPE "WebsiteStatus";

-- CreateTable
CREATE TABLE "region" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "region_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "region_name_key" ON "region"("name");

-- AddForeignKey
ALTER TABLE "websiteTick" ADD CONSTRAINT "websiteTick_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
