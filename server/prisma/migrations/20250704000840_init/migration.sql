-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'DONE', 'BLOCKED');

-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateTable
CREATE TABLE "User" (
    "user_ID" SERIAL NOT NULL,
    "cognito_ID" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "profilePictureUrl" TEXT,
    "team_ID" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_ID")
);

-- CreateTable
CREATE TABLE "Team" (
    "team_ID" SERIAL NOT NULL,
    "teamName" TEXT NOT NULL,
    "productOwneruser_ID" INTEGER,
    "projectManageruser_ID" INTEGER,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("team_ID")
);

-- CreateTable
CREATE TABLE "Project" (
    "project_ID" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),

    CONSTRAINT "Project_pkey" PRIMARY KEY ("project_ID")
);

-- CreateTable
CREATE TABLE "ProjectTeam" (
    "projectTeam_ID" SERIAL NOT NULL,
    "team_ID" INTEGER NOT NULL,
    "project_ID" INTEGER NOT NULL,

    CONSTRAINT "ProjectTeam_pkey" PRIMARY KEY ("projectTeam_ID")
);

-- CreateTable
CREATE TABLE "Task" (
    "task_ID" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "TaskStatus",
    "priority" "TaskPriority",
    "tags" TEXT,
    "startDate" TIMESTAMP(3),
    "dueDate" TIMESTAMP(3),
    "points" INTEGER,
    "project_ID" INTEGER NOT NULL,
    "author_user_ID" INTEGER NOT NULL,
    "assigned_user_ID" INTEGER,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("task_ID")
);

-- CreateTable
CREATE TABLE "TaskAssignment" (
    "id" SERIAL NOT NULL,
    "user_ID" INTEGER NOT NULL,
    "task_ID" INTEGER NOT NULL,

    CONSTRAINT "TaskAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attachment" (
    "id" SERIAL NOT NULL,
    "fileURL" TEXT NOT NULL,
    "fileName" TEXT,
    "task_ID" INTEGER NOT NULL,
    "uploadedById" INTEGER NOT NULL,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "task_ID" INTEGER NOT NULL,
    "user_ID" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_cognito_ID_key" ON "User"("cognito_ID");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_team_ID_idx" ON "User"("team_ID");

-- CreateIndex
CREATE INDEX "Task_project_ID_idx" ON "Task"("project_ID");

-- CreateIndex
CREATE INDEX "Task_author_user_ID_idx" ON "Task"("author_user_ID");

-- CreateIndex
CREATE INDEX "Task_assigned_user_ID_idx" ON "Task"("assigned_user_ID");

-- CreateIndex
CREATE INDEX "TaskAssignment_user_ID_idx" ON "TaskAssignment"("user_ID");

-- CreateIndex
CREATE INDEX "TaskAssignment_task_ID_idx" ON "TaskAssignment"("task_ID");

-- CreateIndex
CREATE INDEX "Attachment_task_ID_idx" ON "Attachment"("task_ID");

-- CreateIndex
CREATE INDEX "Attachment_uploadedById_idx" ON "Attachment"("uploadedById");

-- CreateIndex
CREATE INDEX "Comment_task_ID_idx" ON "Comment"("task_ID");

-- CreateIndex
CREATE INDEX "Comment_user_ID_idx" ON "Comment"("user_ID");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_team_ID_fkey" FOREIGN KEY ("team_ID") REFERENCES "Team"("team_ID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectTeam" ADD CONSTRAINT "ProjectTeam_team_ID_fkey" FOREIGN KEY ("team_ID") REFERENCES "Team"("team_ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectTeam" ADD CONSTRAINT "ProjectTeam_project_ID_fkey" FOREIGN KEY ("project_ID") REFERENCES "Project"("project_ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_project_ID_fkey" FOREIGN KEY ("project_ID") REFERENCES "Project"("project_ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_author_user_ID_fkey" FOREIGN KEY ("author_user_ID") REFERENCES "User"("user_ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_assigned_user_ID_fkey" FOREIGN KEY ("assigned_user_ID") REFERENCES "User"("user_ID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskAssignment" ADD CONSTRAINT "TaskAssignment_user_ID_fkey" FOREIGN KEY ("user_ID") REFERENCES "User"("user_ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskAssignment" ADD CONSTRAINT "TaskAssignment_task_ID_fkey" FOREIGN KEY ("task_ID") REFERENCES "Task"("task_ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_task_ID_fkey" FOREIGN KEY ("task_ID") REFERENCES "Task"("task_ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("user_ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_task_ID_fkey" FOREIGN KEY ("task_ID") REFERENCES "Task"("task_ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_user_ID_fkey" FOREIGN KEY ("user_ID") REFERENCES "User"("user_ID") ON DELETE RESTRICT ON UPDATE CASCADE;
