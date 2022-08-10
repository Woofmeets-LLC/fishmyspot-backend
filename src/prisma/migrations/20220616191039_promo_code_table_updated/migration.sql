/*
  Warnings:

  - You are about to drop the column `discount` on the `PromoCode` table. All the data in the column will be lost.
  - Added the required column `amount` to the `PromoCode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PromoCode" DROP COLUMN "discount",
ADD COLUMN     "amount" INTEGER NOT NULL;
