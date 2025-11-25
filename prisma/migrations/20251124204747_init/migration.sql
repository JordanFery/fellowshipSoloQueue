-- CreateEnum
CREATE TYPE "Role" AS ENUM ('TANK', 'DPS', 'HEAL');

-- CreateEnum
CREATE TYPE "Localisation" AS ENUM ('NA', 'EU', 'ASIA');

-- CreateTable
CREATE TABLE "PlayerRequest" (
    "id" SERIAL NOT NULL,
    "hero" TEXT NOT NULL,
    "imageHero" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "difficulteUnlocked" INTEGER NOT NULL,
    "difficulteRecherche" INTEGER NOT NULL,
    "localisation" "Localisation" NOT NULL,
    "score" INTEGER NOT NULL,
    "lienInvitation" TEXT NOT NULL,
    "lastHeartbeat" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlayerRequest_pkey" PRIMARY KEY ("id")
);
