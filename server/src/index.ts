import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response, NextFunction, Application } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

/* Route import */
import projectRoutes from "./routes/projectRoutes";
import taskRoutes from "./routes/taskRoutes";
import searchRoutes from "./routes/searchRoutes";
import userRoutes from "./routes/userRoutes";
import teamRoutes from "./routes/teamRoutes";

/* configurations */
const app: Application = express();
app.use(express.json());
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
);
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// CORS Configuration
const allowedOrigins = [
  'https://agile-task-manager-client.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

/* Routes */
app.get('/', (req: Request, res: Response) => {
  res.send("Server is running correctly. API endpoints are available at both root and /api/ paths");
});

// API routes - ensure both prefixed and non-prefixed versions
const API_PREFIX = process.env.API_PREFIX || '/api';

// Handle both prefixed and non-prefixed API routes
const registerRoutes = (prefix: string = '') => {
  app.use(`${prefix}/projects`, projectRoutes);
  app.use(`${prefix}/tasks`, taskRoutes);
  app.use(`${prefix}/search`, searchRoutes);
  app.use(`${prefix}/users`, userRoutes);
  app.use(`${prefix}/teams`, teamRoutes);

  // Priority routes
  app.get(`${prefix}/priority/:level`, (req: Request, res: Response) => {
    const { level } = req.params;
    res.json({
      status: 'success',
      data: {
        level,
        tasks: []
      }
    });
  });

  // Tasks with query params
  app.get(`${prefix}/tasks`, (req: Request, res: Response) => {
    const { project_ID } = req.query;
    res.json({
      status: 'success',
      data: {
        project_ID,
        tasks: []
      }
    });
  });
};

// Register routes with both /api prefix and without
registerRoutes();
registerRoutes(API_PREFIX);

// Favicon handler
app.get('/favicon.ico', (req: Request, res: Response) => {
  res.status(204).end();
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://agile-task-manager-client.vercel.app');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.status(404).json({
    status: 'error',
    message: 'Endpoint not found',
    requestedUrl: req.originalUrl
  });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://agile-task-manager-client.vercel.app');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  console.error(err.stack);
  res.status(500).json({ 
    status: 'error',
    error: 'Internal Server Error',
    message: err.message 
  });
});

// Server setup
const port: number = process.env.PORT ? parseInt(process.env.PORT) : 8000;
if (isNaN(port)) {
  console.error(`Invalid PORT value "${process.env.PORT}". Falling back to 8000.`);
}

app.listen(port, () => {
  console.log(`Server Running On Port: ${port}`);
  console.log(`CORS allowed origins: ${allowedOrigins.join(', ')}`);
  console.log(`API available at:`);
  console.log(`- http://localhost:${port}/projects`);
  console.log(`- http://localhost:${port}/api/projects`);
});