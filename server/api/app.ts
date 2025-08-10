import express, { Request, Response, NextFunction, Application } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import projectRoutes from "../src/routes/projectRoutes";
import taskRoutes from "../src/routes/taskRoutes";
import searchRoutes from "../src/routes/searchRoutes";
import userRoutes from "../src/routes/userRoutes";
import teamRoutes from "../src/routes/teamRoutes";

const allowedOrigins = [
  'https://agile-task-manager-client.vercel.app',
  //'http://localhost:3000'
];

const apiApp: Application = express();

apiApp.use(express.json());
apiApp.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
);
apiApp.use(morgan("dev"));
apiApp.use(bodyParser.json());
apiApp.use(bodyParser.urlencoded({ extended: false }));

apiApp.use(cors({
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

// API Root
apiApp.get('/', (req: Request, res: Response) => {
  res.json({
    message: "API Root. Available endpoints:",
    endpoints: [
      '/projects',
      '/tasks',
      '/search',
      '/users',
      '/teams',
      '/priority/:level'
    ]
  });
});

apiApp.use('/projects', projectRoutes);
apiApp.use('/tasks', taskRoutes);
apiApp.use('/search', searchRoutes);
apiApp.use('/users', userRoutes);
apiApp.use('/teams', teamRoutes);

apiApp.get('/priority/:level', (req: Request, res: Response) => {
  const { level } = req.params;
  res.json({
    status: 'success',
    data: { level, tasks: [] }
  });
});

apiApp.get('/favicon.ico', (req: Request, res: Response) => {
  res.status(204).end();
});

// 404 handler
apiApp.use((req: Request, res: Response) => {
  res.setHeader('Access-Control-Allow-Origin', allowedOrigins[0]);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.status(404).json({
    status: 'error',
    message: 'Endpoint not found',
    requestedUrl: req.originalUrl
  });
});

// Error handler
apiApp.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', allowedOrigins[0]);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    error: 'Internal Server Error',
    message: err.message
  });
});

export default apiApp;
