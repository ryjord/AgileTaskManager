// Imports
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import Fuse from "fuse.js";

// Initialize Prisma Client
const prisma = new PrismaClient();

// Search controller function
export const search = async (req: Request, res: Response): Promise<void> => {
  const { query } = req.query;
  try {
    const q = (query as string) || "";
    // Enum values for status and priority
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
      // Fuzzy search for projects
      projects = await prisma.project.findMany();
      const projectFuse = new Fuse(projects, {
        keys: [
          "name",
          "description",
          "project_ID",
          { name: "startDate", getFn: (project) => project.startDate ? new Date(project.startDate).toISOString() : "" },
          { name: "endDate", getFn: (project) => project.endDate ? new Date(project.endDate).toISOString() : "" },
        ],
        threshold: 0.4,
        ignoreLocation: true,
        minMatchCharLength: 2,
      });
      let projectResults = projectFuse.search(q);
      // If a direct project name match, include all tasks under that project
      let matchedProjectIDs: number[] = [];
      for (const result of projectResults) {
        if (result.item.name && result.item.name.toLowerCase() === q.toLowerCase()) {
          matchedProjectIDs.push(result.item.project_ID);
        }
      }

      // Fuzzy search for tasks
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
          { name: "startDate", getFn: (task) => task.startDate ? new Date(task.startDate).toISOString() : "" },
          { name: "dueDate", getFn: (task) => task.dueDate ? new Date(task.dueDate).toISOString() : "" },
        ],
        threshold: 0.4,
        ignoreLocation: true,
        minMatchCharLength: 2,
      });
      let taskResults = taskFuse.search(q);

      // If a direct match exists for task title, show only direct and very close matches
      const directTaskMatches = tasks.filter(t => t.title && t.title.toLowerCase() === q.toLowerCase());
      if (directTaskMatches.length > 0) {
        // Tighter threshold for near matches
        const tightFuse = new Fuse(tasks, {
          keys: ["title"],
          threshold: 0.2,
          ignoreLocation: true,
          minMatchCharLength: 2,
        });
        const tightResults = tightFuse.search(q).map(r => r.item);
        tasks = Array.from(new Set([...directTaskMatches, ...tightResults]));
      } else if (matchedProjectIDs.length > 0) {
        // If a project name matches, only return tasks for that project (plus very close fuzzy matches)
        const projectTasks = tasks.filter(t => matchedProjectIDs.includes(t.project_ID));
        // Tighter threshold for near matches within these tasks
        const tightFuse = new Fuse(projectTasks, {
          keys: ["title", "description"],
          threshold: 0.2,
          ignoreLocation: true,
          minMatchCharLength: 2,
        });
        const tightResults = tightFuse.search(q).map(r => r.item);
        tasks = Array.from(new Set([...projectTasks, ...tightResults]));
      } else {
        // Default: fuzzy task results
        tasks = taskResults.map(r => r.item);
      }

      // Update projects to only fuzzy results
      projects = projectResults.map(r => r.item);
    } else {
      projects = await prisma.project.findMany();
    }

    // Search all string fields for users
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
    res.json({ tasks, projects, users });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error performing search: ${error.message}` });
  }
};