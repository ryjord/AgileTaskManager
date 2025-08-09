import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function purgeAll() {
  await prisma.taskAssignment.deleteMany({});
  await prisma.attachment.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.projectTeam.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.team.deleteMany({});
}

purgeAll()
  .then(() => {
    console.log('All data purged.');
    return prisma.$disconnect();
  })
  .catch((err) => {
    console.error('Error purging data:', err);
    return prisma.$disconnect();
  });