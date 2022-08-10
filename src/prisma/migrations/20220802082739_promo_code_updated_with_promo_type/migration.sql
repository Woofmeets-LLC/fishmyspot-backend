-- CreateEnum
CREATE TYPE "PromoType" AS ENUM ('GIFTCARD', 'DISCOUNT');

-- AlterTable
ALTER TABLE "PromoCode" ADD COLUMN     "type" "PromoType" NOT NULL DEFAULT 'GIFTCARD',
ALTER COLUMN "paymentIntent" DROP NOT NULL;
