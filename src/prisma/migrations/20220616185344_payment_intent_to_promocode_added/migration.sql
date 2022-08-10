/*
  Warnings:

  - You are about to drop the column `paymentIntent` on the `PromoUsage` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[paymentIntent]` on the table `PromoCode` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `paymentIntent` to the `PromoCode` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "PromoUsage_paymentIntent_key";

-- AlterTable
ALTER TABLE "PromoCode" ADD COLUMN     "paymentIntent" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PromoUsage" DROP COLUMN "paymentIntent";

-- CreateIndex
CREATE UNIQUE INDEX "PromoCode_paymentIntent_key" ON "PromoCode"("paymentIntent");
