/*
  Warnings:

  - You are about to drop the `job_details` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "job_details";

-- CreateTable
CREATE TABLE "PushSubscription" (
    "id" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "subscription" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PushSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "metadata" JSONB,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PushSubscription_walletAddress_idx" ON "PushSubscription"("walletAddress");

-- CreateIndex
CREATE INDEX "Notification_walletAddress_idx" ON "Notification"("walletAddress");
