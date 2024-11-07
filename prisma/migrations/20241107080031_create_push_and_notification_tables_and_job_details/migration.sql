/*
  Warnings:

  - You are about to drop the column `walletAddress` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `walletAddress` on the `PushSubscription` table. All the data in the column will be lost.
  - Added the required column `suiAddress` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `suiAddress` to the `PushSubscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `suiAddress` to the `job_details` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Notification_walletAddress_idx";

-- DropIndex
DROP INDEX "PushSubscription_walletAddress_idx";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "walletAddress",
ADD COLUMN     "suiAddress" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PushSubscription" DROP COLUMN "walletAddress",
ADD COLUMN     "suiAddress" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "job_details" ADD COLUMN     "suiAddress" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Notification_suiAddress_idx" ON "Notification"("suiAddress");

-- CreateIndex
CREATE INDEX "PushSubscription_suiAddress_idx" ON "PushSubscription"("suiAddress");

-- CreateIndex
CREATE INDEX "job_details_suiAddress_idx" ON "job_details"("suiAddress");
