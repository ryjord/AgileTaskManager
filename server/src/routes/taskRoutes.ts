import { Router } from "express";
import { createTasks, getTasks } from "../controllers/taskController";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.get("/", getTasks(prisma));
router.post("/", createTasks(prisma));

export default router;

