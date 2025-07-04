/*
  Warnings:

  - The primary key for the `Attachment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Attachment` table. All the data in the column will be lost.
  - The primary key for the `Comment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `points` on the `Task` table. All the data in the column will be lost.
  - The primary key for the `TaskAssignment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `TaskAssignment` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "TaskPriority" ADD VALUE 'BACKLOG';

-- AlterTable
ALTER TABLE "Attachment" DROP CONSTRAINT "Attachment_pkey",
DROP COLUMN "id",
ADD COLUMN     "attachment_ID" SERIAL NOT NULL,
ADD CONSTRAINT "Attachment_pkey" PRIMARY KEY ("attachment_ID");

-- AlterTable
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_pkey",
DROP COLUMN "id",
ADD COLUMN     "comment_ID" SERIAL NOT NULL,
ADD CONSTRAINT "Comment_pkey" PRIMARY KEY ("comment_ID");

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "points";

-- AlterTable
ALTER TABLE "TaskAssignment" DROP CONSTRAINT "TaskAssignment_pkey",
DROP COLUMN "id",
ADD COLUMN     "taskAssignment_ID" SERIAL NOT NULL,
ADD CONSTRAINT "TaskAssignment_pkey" PRIMARY KEY ("taskAssignment_ID");
