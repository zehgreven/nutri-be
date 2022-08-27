-- AlterTable
ALTER TABLE "Functionality" ADD COLUMN     "masterId" UUID;

-- AddForeignKey
ALTER TABLE "Functionality" ADD CONSTRAINT "Functionality_masterId_fkey" FOREIGN KEY ("masterId") REFERENCES "Functionality"("id") ON DELETE SET NULL ON UPDATE CASCADE;
