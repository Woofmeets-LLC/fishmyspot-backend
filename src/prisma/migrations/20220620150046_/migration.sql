/*
  Warnings:

  - A unique constraint covering the columns `[paymentIntent]` on the table `PromoUsage` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `paymentIntent` to the `PromoUsage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PromoUsage" ADD COLUMN     "paymentIntent" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PromoUsage_paymentIntent_key" ON "PromoUsage"("paymentIntent");
