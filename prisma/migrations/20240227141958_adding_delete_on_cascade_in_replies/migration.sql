-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_replyToAuthorId_fkey";

-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "createdAt" DROP NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_replyToAuthorId_fkey" FOREIGN KEY ("replyToAuthorId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
