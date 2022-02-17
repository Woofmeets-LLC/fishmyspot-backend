/*
  Warnings:

  - You are about to drop the column `contenttype` on the `File` table. All the data in the column will be lost.
  - Added the required column `mimetype` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "File" DROP COLUMN "contenttype",
ADD COLUMN     "mimetype" TEXT NOT NULL,
ADD COLUMN     "size" INTEGER;
