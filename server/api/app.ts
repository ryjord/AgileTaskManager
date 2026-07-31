import express, { Request, Response, NextFunction, Application } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";

const apiApp: Application = express();

// helmet was already a dependency; this replaces a hand-rolled subset of the
// same headers and additionally covers HSTS and cross-origin policies.
apiApp.use(helmet());

apiApp.use(morgan("dev"));
apiApp.use(express.json());
apiApp.use(bodyParser.json());
apiApp.use(bodyParser.urlencoded({ extended: false }));

// CORS configuration
apiApp.use(cors({
  origin: [
    'https://agile-task-manager-client.vercel.app',
    /\.vercel\.app$/
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// API Root (handles both / and /api)
apiApp.get('/', (req: Request, res: Response) => {
  res.json({
    message: "API Root. Available endpoints:",
    endpoints: [
      '/projects',
      '/tasks',
      '/search',
      '/users',
      '/teams'
    ]
  });
});

// Import and use your routes
import projectRoutes from "../src/routes/projectRoutes";
import taskRoutes from "../src/routes/taskRoutes";
import searchRoutes from "../src/routes/searchRoutes";
import userRoutes from "../src/routes/userRoutes";
import teamRoutes from "../src/routes/teamRoutes";

apiApp.use('/projects', projectRoutes);
apiApp.use('/tasks', taskRoutes);
apiApp.use('/search', searchRoutes);
apiApp.use('/users', userRoutes);
apiApp.use('/teams', teamRoutes);

// 404 Handler
apiApp.use((req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint not found',
    path: req.originalUrl
  });
});

// Error Handler
apiApp.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    error: 'Internal Server Error',
    message: err.message
  });
});

export default apiApp;