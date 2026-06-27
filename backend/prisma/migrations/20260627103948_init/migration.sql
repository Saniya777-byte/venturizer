-- CreateEnum
CREATE TYPE "public"."LeadType" AS ENUM ('FOUNDER', 'INVESTOR');

-- CreateEnum
CREATE TYPE "public"."LeadStatus" AS ENUM ('HOT', 'GOOD', 'MAYBE', 'LOW');

-- CreateEnum
CREATE TYPE "public"."MvpStatus" AS ENUM ('IDEA', 'IN_PROGRESS', 'COMPLETED');

-- CreateTable
CREATE TABLE "public"."Lead" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "linkedIn" TEXT,
    "type" "public"."LeadType" NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "status" "public"."LeadStatus" NOT NULL DEFAULT 'MAYBE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FounderProfile" (
    "id" TEXT NOT NULL,
    "startupName" TEXT NOT NULL,
    "background" TEXT NOT NULL,
    "problem" TEXT NOT NULL,
    "mvpStatus" "public"."MvpStatus" NOT NULL,
    "traction" TEXT,
    "teamSize" INTEGER,
    "fundingAsk" DOUBLE PRECISION,
    "validationEvidence" TEXT,
    "extraResponses" JSONB,
    "leadId" TEXT NOT NULL,

    CONSTRAINT "FounderProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."InvestorProfile" (
    "id" TEXT NOT NULL,
    "investmentThesis" TEXT NOT NULL,
    "stageFocus" TEXT NOT NULL,
    "chequeSize" DOUBLE PRECISION,
    "currentPortfolio" TEXT,
    "supportModel" TEXT,
    "deploymentTimeline" TEXT,
    "extraResponses" JSONB,
    "leadId" TEXT NOT NULL,

    CONSTRAINT "InvestorProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Lead_email_key" ON "public"."Lead"("email");

-- CreateIndex
CREATE UNIQUE INDEX "FounderProfile_leadId_key" ON "public"."FounderProfile"("leadId");

-- CreateIndex
CREATE UNIQUE INDEX "InvestorProfile_leadId_key" ON "public"."InvestorProfile"("leadId");

-- AddForeignKey
ALTER TABLE "public"."FounderProfile" ADD CONSTRAINT "FounderProfile_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "public"."Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InvestorProfile" ADD CONSTRAINT "InvestorProfile_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "public"."Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
