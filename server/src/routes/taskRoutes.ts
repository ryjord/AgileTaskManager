import { Router } from "express";
// Import controller functions for handling task-related requests
import { createTasks, getTasks, updateTaskStatus, getUserTasks } from "../controllers/taskController";
// Import PrismaClient for database access
import { PrismaClient } from "@prisma/client";

// Create a new Express router instance for task routes
const router = Router();

// Instantiate a single PrismaClient instance for use in all route handlers
const prisma = new PrismaClient();

// Route: GET /
// Description: Fetch a paginated list of tasks for a given project.
// Controller: getTasks handles validation, querying, and response formatting.
router.get("/", getTasks(prisma));

// Route: POST /
// Description: Create a new task with the provided data in the request body.
// Controller: createTasks handles validation, creation, and response.
router.post("/", createTasks(prisma));

// Route: PATCH /:task_ID/TaskStatus
// Description: Update the status of a specific task identified by task_ID.
// Controller: updateTaskStatus handles validation, existence check, update, and response.
router.patch("/:task_ID/status", updateTaskStatus(prisma));

// Route: GET /user/:user_ID
// Description: Fetch every task authored by or assigned to a user. Declared
// before the parameterised task routes so "user" is not read as a task_ID.
router.get("/user/:user_ID", getUserTasks(prisma));

// Export the configured router for use in the main application
export default router;