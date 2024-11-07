/*
  Warnings:

  - A unique constraint covering the columns `[sui_address]` on the table `PushSubscription` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PushSubscription_sui_address_key" ON "PushSubscription"("sui_address");
