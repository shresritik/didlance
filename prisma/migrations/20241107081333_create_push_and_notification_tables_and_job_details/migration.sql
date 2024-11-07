/*
  Warnings:

  - You are about to drop the column `suiAddress` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `suiAddress` on the `PushSubscription` table. All the data in the column will be lost.
  - You are about to drop the column `suiAddress` on the `job_details` table. All the data in the column will be lost.
  - Added the required column `sui_address` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sui_address` to the `PushSubscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sui_address` to the `job_details` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Notification_suiAddress_idx";

-- DropIndex
DROP INDEX "PushSubscription_suiAddress_idx";

-- DropIndex
DROP INDEX "job_details_suiAddress_idx";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "suiAddress",
ADD COLUMN     "sui_address" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PushSubscription" DROP COLUMN "suiAddress",
ADD COLUMN     "sui_address" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "job_details" DROP COLUMN "suiAddress",
ADD COLUMN     "sui_address" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Notification_sui_address_idx" ON "Notification"("sui_address");

-- CreateIndex
CREATE INDEX "PushSubscription_sui_address_idx" ON "PushSubscription"("sui_address");

-- CreateIndex
CREATE INDEX "job_details_sui_address_idx" ON "job_details"("sui_address");
