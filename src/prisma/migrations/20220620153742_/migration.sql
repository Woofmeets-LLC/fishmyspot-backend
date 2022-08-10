/*
  Warnings:

  - Made the column `email` on table `PromoCode` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "PromoCode" ALTER COLUMN "email" SET NOT NULL;
