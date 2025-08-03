import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { Request, Response, NextFunction } from "express";

/* Route import */
import projectRoutes from "./routes/projectRoutes";
import taskRoutes from "./routes/taskRoutes";
import searchRoutes from "./routes/searchRoutes";
import userRoutes from "./routes/userRoutes";
import teamRoutes from "./routes/teamRoutes";

/* configurations */
const app = express();
app.use(express.json());
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
);
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// CORS: Allow requests from frontend (localhost:3000) during development
app.use(cors());

/* Routes */
app.get('/', (req, res) => {
  res.send("this server is running correctly");
});

// usage cases
app.use("/projects", projectRoutes);
app.use("/tasks", taskRoutes);
app.use("/search", searchRoutes);
app.use("/users", userRoutes);
app.use("/teams", teamRoutes);

// Catch-all 404 handler
app.use((req, res) => {
  res.status(404).send('Not Found');
});

// Error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Use PORT from env or fallback to 8000 for backend (not 3000!)
const portEnv = process.env.PORT;
const port = portEnv && !isNaN(Number(portEnv)) ? Number(portEnv) : 8000;
if (portEnv && isNaN(Number(portEnv))) {
  console.error(`Invalid PORT value "${portEnv}". Falling back to 8000.`);
}
app.listen(port, () => {
  console.log(`Server Running On Port : ${port} `);
  console.log(`CORS allowed origins: http://localhost:3000`);
});