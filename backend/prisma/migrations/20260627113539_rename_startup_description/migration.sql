/*
  Warnings:

  - You are about to drop the column `extraResponses` on the `FounderProfile` table. All the data in the column will be lost.
  - You are about to drop the column `startupName` on the `FounderProfile` table. All the data in the column will be lost.
  - You are about to drop the column `extraResponses` on the `InvestorProfile` table. All the data in the column will be lost.
  - Added the required column `companyName` to the `FounderProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customer` to the `FounderProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `FounderProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startupDescription` to the `FounderProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `capitalAvailable` to the `InvestorProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firmName` to the `InvestorProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `handsOnLevel` to the `InvestorProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `leadOrFollow` to the `InvestorProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roleAtFirm` to the `InvestorProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sectors` to the `InvestorProfile` table without a default value. This is not possible if the table is not empty.
  - Made the column `supportModel` on table `InvestorProfile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `deploymentTimeline` on table `InvestorProfile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."FounderProfile" DROP COLUMN "extraResponses",
DROP COLUMN "startupName",
ADD COLUMN     "companyName" TEXT NOT NULL,
ADD COLUMN     "customer" TEXT NOT NULL,
ADD COLUMN     "fundingStage" TEXT,
ADD COLUMN     "mvpLink" TEXT,
ADD COLUMN     "notableBacking" TEXT,
ADD COLUMN     "role" TEXT NOT NULL,
ADD COLUMN     "startupDescription" TEXT NOT NULL,
ADD COLUMN     "teamFullTime" TEXT,
ADD COLUMN     "useOfFunds" TEXT;

-- AlterTable
ALTER TABLE "public"."InvestorProfile" DROP COLUMN "extraResponses",
ADD COLUMN     "capitalAvailable" TEXT NOT NULL,
ADD COLUMN     "chequeRange" TEXT,
ADD COLUMN     "dealsPerYear" INTEGER,
ADD COLUMN     "firmName" TEXT NOT NULL,
ADD COLUMN     "handsOnLevel" TEXT NOT NULL,
ADD COLUMN     "leadOrFollow" TEXT NOT NULL,
ADD COLUMN     "portfolioConflicts" TEXT,
ADD COLUMN     "roleAtFirm" TEXT NOT NULL,
ADD COLUMN     "sectors" TEXT NOT NULL,
ALTER COLUMN "supportModel" SET NOT NULL,
ALTER COLUMN "deploymentTimeline" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."Lead" ADD COLUMN     "completed" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "public"."Answer" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ScoreBreakdown" (
    "id" TEXT NOT NULL,
    "criterion" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "maxPoints" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScoreBreakdown_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Answer" ADD CONSTRAINT "Answer_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "public"."Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ScoreBreakdown" ADD CONSTRAINT "ScoreBreakdown_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "public"."Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
