import { Router } from "express";
import { search } from "../controllers/searchController";

const router = Router();

// Main search endpoint
router.get("/", search);

// GET /api/search/tasks?project_ID=1
router.get("/tasks", async (req, res) => {
  // TODO: Replace with real DB logic
  // Example: filter by project_ID if provided
  const { project_ID } = req.query;
  // For now, just return a placeholder
  res.json({
    tasks: [],
    message: `Fetched tasks${project_ID ? ` for project_ID=${project_ID}` : ''}`
  });
});

// GET /api/search/projects?limit=100
router.get("/projects", async (req, res) => {
  // TODO: Replace with real DB logic
  const { limit } = req.query;
  // For now, just return a placeholder
  res.json({
    projects: [],
    message: `Fetched projects${limit ? ` with limit=${limit}` : ''}`
  });
});

export default router;
