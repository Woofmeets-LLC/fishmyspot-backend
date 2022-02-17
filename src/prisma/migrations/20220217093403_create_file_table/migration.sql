-- CreateTable
CREATE TABLE "File" (
    "id" SERIAL NOT NULL,
    "filename" TEXT NOT NULL,
    "contenttype" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "fishId" INTEGER,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_fishId_fkey" FOREIGN KEY ("fishId") REFERENCES "Fish"("id") ON DELETE SET NULL ON UPDATE CASCADE;
