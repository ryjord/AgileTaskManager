
// Controller for handling project-related API requests
import { PrismaClient } from "@prisma/client";
import { Response, Request } from "express";

/**
 * Returns an Express handler to fetch a paginated list of projects from the database.
 * @param prisma - PrismaClient instance for database access
 */
export const getProjects = (prisma: PrismaClient) => async (
    req: Request,
    res: Response
): Promise<void> => {
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

        // Fetch projects from the database with pagination and explicit field selection
        const projects = await prisma.project.findMany({
            skip: offset,
            take: limit,
            select: {
                project_ID: true,
                name: true,
                description: true,
                startDate: true,
                endDate: true
            }
        });
        // Get total count for pagination metadata
        const total = await prisma.project.count();
        // Respond with projects and pagination metadata
        res.status(200).json({
            data: projects,
            meta: {
                total,
                limit,
                offset
            }
        });
    } catch (error) {
        // Log and respond with error if fetching fails
        console.error('Error fetching projects:', error);
        res.status(500).json({
            message: "An error occurred while processing your request.",
            error: error instanceof Error ? error.message : String(error)
        });
    }
};



export const createProject = (prisma: PrismaClient) => async (
    req: Request,
    res: Response
): Promise<void> => {
    const { name, description, startDate, endDate } = req.body;
    // Check for required fields
    if (!name || !startDate || !endDate) {
        res.status(400).json({ message: "Missing required fields: name, startDate, endDate" });
        return;
    }
    // Basic validation and sanitization
    if (
      typeof name !== "string" ||
      typeof description !== "string" ||
      !name.trim() ||
      !description.trim() ||
      isNaN(Date.parse(startDate)) ||
      isNaN(Date.parse(endDate))
    ) {
      res.status(400).json({ message: "Invalid input data" });
      return;
    }
    try {
        const newProject = await prisma.project.create({
            data: {
                name: name.trim(),
                description: description.trim(),
                startDate: new Date(startDate),
                endDate: new Date(endDate)
            }
        });
        // Respond with the newly created project
        res.status(201).json(newProject);
    } catch (error) {
        // Log and respond with error if creation fails
        console.error('Error creating projects:', error);
        res.status(500).json({
            message: "An error occurred while processing your request.",
            error: error instanceof Error ? error.message : String(error)
        });
    }
};