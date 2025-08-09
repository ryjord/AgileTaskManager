import { PrismaClient, Prisma } from "@prisma/client";
import fs from "fs";
import path from "path";
const prisma = new PrismaClient();
const dataDirectory = path.join(__dirname, "seedData");

function isValidData(data: any): boolean {
  return data && typeof data === "object";
}

async function main() {
  // Purge all data in correct order
  await prisma.$transaction(async (tx) => {
    await tx.taskAssignment.deleteMany({});
    await tx.comment.deleteMany({});
    await tx.attachment.deleteMany({});
    await tx.task.deleteMany({});
    await tx.projectTeam.deleteMany({});
    await tx.user.deleteMany({});
    await tx.project.deleteMany({});
    await tx.team.deleteMany({});
  });
  console.log("Cleared all data");

  // Insert teams
  const teamData: Omit<Prisma.TeamCreateInput, 'team_ID'>[] = JSON.parse(await fs.promises.readFile(path.join(dataDirectory, "team.json"), "utf-8"));
  const createdTeams: { team_ID: number }[] = [];
  for (const team of teamData) {
    const { teamName, productOwneruser_ID, projectManageruser_ID } = team;
    const created = await prisma.team.create({ data: { teamName, productOwneruser_ID, projectManageruser_ID } });
    createdTeams.push({ team_ID: created.team_ID });
  }
  console.log("Seeded team with data from team.json");

  // Insert projects
  const projectData: Omit<Prisma.ProjectCreateInput, 'project_ID'>[] = JSON.parse(await fs.promises.readFile(path.join(dataDirectory, "project.json"), "utf-8"));
  const createdProjects: { project_ID: number }[] = [];
  for (const project of projectData) {
    const { name, description, startDate, endDate } = project;
    const created = await prisma.project.create({ data: { name, description, startDate, endDate } });
    createdProjects.push({ project_ID: created.project_ID });
  }
  console.log("Seeded project with data from project.json");

  // Build projectTeam data using actual IDs
  const projectTeamRaw: { team_ID: number, project_ID: number }[] = JSON.parse(await fs.promises.readFile(path.join(dataDirectory, "projectTeam.json"), "utf-8"));
  const projectTeamData = projectTeamRaw.map((pt) => ({
    team_ID: createdTeams[pt.team_ID - 1]?.team_ID,
    project_ID: createdProjects[pt.project_ID - 1]?.project_ID,
  })).filter(pt => pt.team_ID !== undefined && pt.project_ID !== undefined);
  await prisma.projectTeam.createMany({ data: projectTeamData });
  console.log("Seeded projectTeam with mapped IDs");

  // Insert users with mapped team_ID
  const userData: any[] = JSON.parse(await fs.promises.readFile(path.join(dataDirectory, "user.json"), "utf-8"));
  const createdUsers: { user_ID: number, username: string }[] = [];
  for (const [i, user] of userData.entries()) {
    const { username, team_ID, profilePictureUrl, cognito_ID } = user;
    const created = await prisma.user.create({
      data: {
        username,
        team_ID: createdTeams[team_ID - 1]?.team_ID,
        profilePictureUrl,
        cognito_ID
      }
    });
    createdUsers.push({ user_ID: created.user_ID, username });
  }
  console.log("Seeded user with mapped team_IDs");

  // Insert tasks with mapped project_ID, author_user_ID, assigned_user_ID
  const taskData: any[] = JSON.parse(await fs.promises.readFile(path.join(dataDirectory, "task.json"), "utf-8"));
  const createdTasks: { task_ID: number }[] = [];
  for (const task of taskData) {
    const { title, description, status, priority, tags, startDate, dueDate, points, project_ID, author_user_ID, assigned_user_ID, updatedAt } = task;
    const created = await prisma.task.create({
      data: {
        title,
        description,
        status,
        priority,
        tags,
        startDate,
        dueDate,
        points,
        project_ID: createdProjects[project_ID - 1]?.project_ID,
        author_user_ID: createdUsers[author_user_ID - 1]?.user_ID,
        assigned_user_ID: createdUsers[assigned_user_ID - 1]?.user_ID,
        updatedAt
      }
    });
    createdTasks.push({ task_ID: created.task_ID });
  }
  console.log("Seeded task with mapped project/user IDs");

  // Insert attachments with mapped task_ID and uploadedById
  const attachmentData: any[] = JSON.parse(await fs.promises.readFile(path.join(dataDirectory, "attachment.json"), "utf-8"));
  for (const attachment of attachmentData) {
    const { fileURL, fileName, task_ID, uploadedById } = attachment;
    await prisma.attachment.create({
      data: {
        fileURL,
        fileName,
        task_ID: createdTasks[task_ID - 1]?.task_ID,
        uploadedById: createdUsers[uploadedById - 1]?.user_ID
      }
    });
  }
  console.log("Seeded attachment with mapped task/user IDs");

  // Insert comments with mapped task_ID and user_ID
  const commentData: any[] = JSON.parse(await fs.promises.readFile(path.join(dataDirectory, "comment.json"), "utf-8"));
  for (const comment of commentData) {
    const { text, task_ID, user_ID, updatedAt } = comment;
    await prisma.comment.create({
      data: {
        text,
        task_ID: createdTasks[task_ID - 1]?.task_ID,
        user_ID: createdUsers[user_ID - 1]?.user_ID,
        updatedAt
      }
    });
  }
  console.log("Seeded comment with mapped task/user IDs");

  // Insert taskAssignments with mapped user_ID and task_ID
  const taskAssignmentData: any[] = JSON.parse(await fs.promises.readFile(path.join(dataDirectory, "taskAssignment.json"), "utf-8"));
  for (const ta of taskAssignmentData) {
    const { user_ID, task_ID } = ta;
    await prisma.taskAssignment.create({
      data: {
        user_ID: createdUsers[user_ID - 1]?.user_ID,
        task_ID: createdTasks[task_ID - 1]?.task_ID
      }
    });
  }
  console.log("Seeded taskAssignment with mapped user/task IDs");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
