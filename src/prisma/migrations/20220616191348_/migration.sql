/*
  Warnings:

  - You are about to drop the column `code` on the `PromoCode` table. All the data in the column will be lost.
  - You are about to drop the column `code` on the `PromoUsage` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[promo]` on the table `PromoCode` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `promo` to the `PromoCode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `promo` to the `PromoUsage` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PromoUsage" DROP CONSTRAINT "PromoUsage_code_fkey";

-- DropIndex
DROP INDEX "PromoCode_code_key";

-- AlterTable
ALTER TABLE "PromoCode" DROP COLUMN "code",
ADD COLUMN     "promo" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PromoUsage" DROP COLUMN "code",
ADD COLUMN     "promo" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PromoCode_promo_key" ON "PromoCode"("promo");

-- AddForeignKey
ALTER TABLE "PromoUsage" ADD CONSTRAINT "PromoUsage_promo_fkey" FOREIGN KEY ("promo") REFERENCES "PromoCode"("promo") ON DELETE RESTRICT ON UPDATE CASCADE;
