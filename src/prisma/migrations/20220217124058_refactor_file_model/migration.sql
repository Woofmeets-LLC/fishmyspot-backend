/*
  Warnings:

  - You are about to drop the column `fishId` on the `File` table. All the data in the column will be lost.
  - Added the required column `fileId` to the `Fish` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_fishId_fkey";

-- AlterTable
ALTER TABLE "File" DROP COLUMN "fishId",
ADD COLUMN     "additional" JSONB;

-- AlterTable
ALTER TABLE "Fish" ADD COLUMN     "fileId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Fish" ADD CONSTRAINT "Fish_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
