/*
  Warnings:

  - The values [EMAIL,FACEBOOK] on the enum `Provider` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Provider_new" AS ENUM ('CREDENTIALS', 'GOOGLE', 'GITHUB');
ALTER TABLE "User" ALTER COLUMN "provider" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "provider" TYPE "Provider_new" USING ("provider"::text::"Provider_new");
ALTER TYPE "Provider" RENAME TO "Provider_old";
ALTER TYPE "Provider_new" RENAME TO "Provider";
DROP TYPE "Provider_old";
ALTER TABLE "User" ALTER COLUMN "provider" SET DEFAULT 'CREDENTIALS';
COMMIT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "provider" SET DEFAULT 'CREDENTIALS';
