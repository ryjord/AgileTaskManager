import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import Fuse from 'fuse.js';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req.query;
  try {
    const q = (query as string) || "";
    const validStatuses = [
      "To Do",
      "Work In Progress",
      "Task Completed",
      "Under Review"
    ];
    const validPriorities = [
      "Low",
      "Medium",
      "High",
      "Critical",
      "Backlog"
    ];
    let tasks = await prisma.task.findMany();
    let projects;
    if (q) {
      projects = await prisma.project.findMany();
      const projectFuse = new Fuse(projects, {
        keys: [
          "name",
          "description",
          "project_ID",
          { name: "startDate", getFn: (project: any) => project.startDate ? new Date(project.startDate).toISOString() : "" },
          { name: "endDate", getFn: (project: any) => project.endDate ? new Date(project.endDate).toISOString() : "" },
        ],
        threshold: 0.4,
        ignoreLocation: true,
        minMatchCharLength: 2,
      });
      let projectResults = projectFuse.search(q);
      let matchedProjectIDs: number[] = [];
      for (const result of projectResults) {
        if (result.item.name && result.item.name.toLowerCase() === q.toLowerCase()) {
          matchedProjectIDs.push(result.item.project_ID);
        }
      }
      const taskFuse = new Fuse(tasks, {
        keys: [
          "title",
          "description",
          "tags",
          "status",
          "priority",
          "project_ID",
          "author_user_ID",
          "assigned_user_ID",
          { name: "startDate", getFn: (task: any) => task.startDate ? new Date(task.startDate).toISOString() : "" },
          { name: "dueDate", getFn: (task: any) => task.dueDate ? new Date(task.dueDate).toISOString() : "" },
        ],
        threshold: 0.4,
        ignoreLocation: true,
        minMatchCharLength: 2,
      });
      let taskResults = taskFuse.search(q);
      const directTaskMatches = tasks.filter(t => t.title && t.title.toLowerCase() === q.toLowerCase());
      if (directTaskMatches.length > 0) {
        const tightFuse = new Fuse(tasks, {
          keys: ["title"],
          threshold: 0.2,
          ignoreLocation: true,
          minMatchCharLength: 2,
        });
        const tightResults = tightFuse.search(q).map(r => r.item);
        tasks = Array.from(new Set([...directTaskMatches, ...tightResults]));
      } else if (matchedProjectIDs.length > 0) {
        const projectTasks = tasks.filter(t => matchedProjectIDs.includes(t.project_ID));
        const tightFuse = new Fuse(projectTasks, {
          keys: ["title", "description"],
          threshold: 0.2,
          ignoreLocation: true,
          minMatchCharLength: 2,
        });
        const tightResults = tightFuse.search(q).map(r => r.item);
        tasks = Array.from(new Set([...projectTasks, ...tightResults]));
      } else {
        tasks = taskResults.map(r => r.item);
      }
      projects = projectResults.map(r => r.item);
    } else {
      projects = await prisma.project.findMany();
    }
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: q, mode: "insensitive" } },
          { profilePictureUrl: { contains: q, mode: "insensitive" } },
          { user_ID: { equals: isNaN(Number(q)) ? undefined : Number(q) } },
          { team_ID: { equals: isNaN(Number(q)) ? undefined : Number(q) } },
        ],
      },
    });
    res.status(200).json({ tasks, projects, users });
  } catch (error: any) {
    res.status(500).json({ message: `Error performing search: ${error.message}` });
  }
}
