import { Router } from "express";
import { search } from "../controllers/searchController";

const router = Router();

// Route: GET /?query=
// Description: Fuzzy search across tasks, projects and users.
router.get("/", search);

export default router;
