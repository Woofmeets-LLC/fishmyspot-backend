/*
  Warnings:

  - Added the required column `pondId` to the `PromoUsage` table without a default value. This is not possible if the table is not empty.
  - Made the column `pondOwnerId` on table `PromoUsage` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "PromoUsage" ADD COLUMN     "pondId" TEXT NOT NULL,
ALTER COLUMN "pondOwnerId" SET NOT NULL;
