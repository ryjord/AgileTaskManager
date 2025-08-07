import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../lib/prisma';
import { TaskStatus, TaskPriority } from '@prisma/client';

function isTaskStatus(value: any): value is TaskStatus {
  return Object.values(TaskStatus).includes(value as TaskStatus);
}
function isTaskPriority(value: any): value is TaskPriority {
  return Object.values(TaskPriority).includes(value as TaskPriority);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { project_ID } = req.query;
    const projectIdNum = Number(project_ID);
    if (!project_ID || isNaN(projectIdNum) || projectIdNum <= 0) {
      res.status(400).json({ message: "Missing or invalid 'project_ID' query parameter." });
      return;
    }
    try {
      const limit = (() => {
        const val = parseInt(req.query.limit as string);
        if (isNaN(val) || val <= 0 || val > 100) return 10;
        return val;
      })();
      const offset = (() => {
        const val = parseInt(req.query.offset as string);
        if (isNaN(val) || val < 0) return 0;
        return val;
      })();
      const [tasks, total] = await Promise.all([
        prisma.task.findMany({
          skip: offset,
          take: limit,
          where: { project_ID: projectIdNum },
          include: {
            author: true,
            assignee: true,
            comments: true,
            attachments: true,
          },
        }),
        prisma.task.count({ where: { project_ID: projectIdNum } })
      ]);
      res.status(200).json({ data: tasks, meta: { total, limit, offset } });
    } catch (error) {
      res.status(500).json({ message: "An error occurred while processing your request." });
    }
  } else if (req.method === 'POST') {
    const { title, description, status, priority, tags, startDate, dueDate, points, project_ID, author_user_ID, assigned_user_ID, updatedAt } = req.body;
    if (!title || !startDate || !dueDate) {
      res.status(400).json({ message: "Missing required fields: title, startDate, dueDate" });
      return;
    }
    if (
      typeof title !== "string" ||
      (description && (typeof description !== "string" || !description.trim())) ||
      !title.trim() ||
      isNaN(Date.parse(startDate)) ||
      isNaN(Date.parse(dueDate))
    ) {
      res.status(400).json({ message: "Invalid input data" });
      return;
    }
    if (status && !isTaskStatus(status)) {
      res.status(400).json({ message: "Invalid status value." });
      return;
    }
    if (priority && !isTaskPriority(priority)) {
      res.status(400).json({ message: "Invalid priority value." });
      return;
    }
    if (tags && (!Array.isArray(tags) || !tags.every((tag: any) => typeof tag === "string"))) {
      res.status(400).json({ message: "Invalid tags value." });
      return;
    }
    if (
      (project_ID && (isNaN(Number(project_ID)) || Number(project_ID) <= 0)) ||
      (author_user_ID && (isNaN(Number(author_user_ID)) || Number(author_user_ID) <= 0)) ||
      (assigned_user_ID && (isNaN(Number(assigned_user_ID)) || Number(assigned_user_ID) <= 0))
    ) {
      res.status(400).json({ message: "Invalid ID values." });
      return;
    }
    try {
      const newTask = await prisma.task.create({
        data: {
          title,
          description,
          status,
          priority,
          tags,
          startDate,
          dueDate,
          points,
          project_ID,
          author_user_ID,
          assigned_user_ID,
          updatedAt,
        },
        select: {
          task_ID: true,
          title: true,
          status: true,
          priority: true,
          dueDate: true,
        }
      });
      res.status(201).json(newTask);
    } catch (error) {
      res.status(500).json({ message: "An error occurred while processing your request." });
    }
  } else if (req.method === 'PATCH') {
    const { task_ID, status } = req.body;
    if (!task_ID || isNaN(Number(task_ID))) {
      res.status(400).json({ message: "Invalid or missing task_ID parameter." });
      return;
    }
    if (!isTaskStatus(status)) {
      res.status(400).json({ message: "Invalid status value." });
      return;
    }
    try {
      const existingTask = await prisma.task.findUnique({ where: { task_ID: Number(task_ID) } });
      if (!existingTask) {
        res.status(404).json({ message: "Task not found." });
        return;
      }
      const updatedTask = await prisma.task.update({
        where: { task_ID: Number(task_ID) },
        data: { status: status as TaskStatus },
      });
      res.status(200).json(updatedTask);
    } catch (error) {
      res.status(500).json({ message: "An error occurred while updating the task status." });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PATCH']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
