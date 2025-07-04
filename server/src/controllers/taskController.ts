import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const getTasks = (prisma: PrismaClient) => async (
    req: Request,
    res: Response
): Promise<void> => {
    const { project_ID } = req.query;

    // Validate project_ID
    const projectIdNum = Number(project_ID);
    if (!project_ID || isNaN(projectIdNum) || projectIdNum <= 0) {
        res.status(400).json({
            message: "Missing or invalid 'project_ID' query parameter."
        });
        return;
    }

    try {
        // Parse and validate 'limit' query parameter, default to 10 if invalid or not provided
        const limit = (() => {
            const val = parseInt(req.query.limit as string);
            if (isNaN(val) || val <= 0 || val > 100) return 10;
            return val;
        })();
        // Parse and validate 'offset' query parameter, default to 0 if invalid or not provided
        const offset = (() => {
            const val = parseInt(req.query.offset as string);
            if (isNaN(val) || val < 0) return 0;
            return val;
        })();

        // Fetch tasks from the database with pagination and explicit field selection
        const tasks = await prisma.task.findMany({
            skip: offset,
            take: limit,
            where: {
                project_ID: projectIdNum,
            },
            include: {
                author: true,
                assignee: true,
                comments: true,
                attachments: true
            },
        });
        // Get total count for pagination metadata
        const total = await prisma.task.count({
            where: {
                project_ID: projectIdNum,
            }
        });
        // Respond with tasks and pagination metadata
        res.status(200).json({
            data: tasks,
            meta: {
                total,
                limit,
                offset
            }
        });
    } catch (error) {
        // Log and respond with error if fetching fails
        console.error('Error fetching tasks:', error);
        res.status(500).json({
            message: "An error occurred while processing your request.",
            error: error instanceof Error ? error.message : String(error)
        });
    }
};


export const createTasks = (prisma: PrismaClient) => async (
    req: Request,
    res: Response
): Promise<void> => {
    const { title, description, status, priority, tags, startDate, dueDate, points, project_ID, author_user_ID, assigned_user_ID, updatedAt} = req.body;
    // Check for required fields
    if (!title || !startDate || !dueDate) {
        res.status(400).json({ message: "Missing required fields: title, startDate, dueDate" });
        return;
    }
    // Basic validation and sanitization
    if (
      typeof title !== "string" ||
      typeof description !== "string" ||
      !title.trim() ||
      !description.trim() ||
      isNaN(Date.parse(startDate)) ||
      isNaN(Date.parse(dueDate))
    ) {
      res.status(400).json({ message: "Invalid input data" });
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
                updatedAt
            }
        });
        // Respond with the newly created tasks
        res.status(201).json(newTask);
    } catch (error) {
        // Log and respond with error if creation fails
        console.error('Error creating tasks:', error);
        res.status(500).json({
            message: "An error occurred while processing your request.",
            error: error instanceof Error ? error.message : String(error)
        });
    }
};

export { getTasks };