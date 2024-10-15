-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "whatYouWillLearn" TEXT,
ALTER COLUMN "objectives" DROP NOT NULL,
ALTER COLUMN "objectives" SET DATA TYPE TEXT;
