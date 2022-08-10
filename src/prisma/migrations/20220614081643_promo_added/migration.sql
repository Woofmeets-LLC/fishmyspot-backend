-- CreateTable
CREATE TABLE "PromoCode" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "discount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PromoCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromoUsage" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "anglerId" TEXT NOT NULL,
    "pondOwnerId" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "paymentIntent" TEXT NOT NULL,
    "usedAmount" INTEGER NOT NULL,
    "payout" BOOLEAN NOT NULL DEFAULT false,
    "isSuccess" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PromoUsage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PromoCode_code_key" ON "PromoCode"("code");

-- CreateIndex
CREATE UNIQUE INDEX "PromoUsage_transactionId_key" ON "PromoUsage"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "PromoUsage_paymentIntent_key" ON "PromoUsage"("paymentIntent");

-- AddForeignKey
ALTER TABLE "PromoUsage" ADD CONSTRAINT "PromoUsage_code_fkey" FOREIGN KEY ("code") REFERENCES "PromoCode"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
