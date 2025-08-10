import { Router } from "express";
import { createProject, getProjects, } from "../controllers/projectController";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.get("/", getProjects(prisma));
router.post("/", createProject(prisma));

//router.delete("/:project_ID", (req, res) => deleteProject(prisma)(req, res));

export default router;

