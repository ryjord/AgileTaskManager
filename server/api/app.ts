import express, { Request, Response, NextFunction, Application } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import projectRoutes from "./routes/projectRoutes";
import taskRoutes from "./routes/taskRoutes";
import searchRoutes from "./routes/searchRoutes";
import userRoutes from "./routes/userRoutes";
import teamRoutes from "./routes/teamRoutes";

const allowedOrigins = [
  'https://agile-task-manager-client.vercel.app',
  /\.vercel\.app$/  // regex for any Vercel preview deployment
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
    const allowed = allowedOrigins.some(o =>
      typeof o === 'string' ? o === origin : o.test(origin)
    );
    if (!allowed) {
      return callback(new Error(`CORS policy does not allow origin: ${origin}`), false);
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

apiApp.use('routes/projects', projectRoutes);
apiApp.use('routes/tasks', taskRoutes);
apiApp.use('routes/search', searchRoutes);
apiApp.use('routes/users', userRoutes);
apiApp.use('routes/teams', teamRoutes);

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
  const corsOrigin = allowedOrigins.find(o => typeof o === 'string') as string;
  res.setHeader('Access-Control-Allow-Origin', corsOrigin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.status(404).json({
    status: 'error',
    message: 'Endpoint not found',
    requestedUrl: req.originalUrl
  });
});


// Error handler
apiApp.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  const corsOrigin = allowedOrigins.find(o => typeof o === 'string') as string;
  res.setHeader('Access-Control-Allow-Origin', corsOrigin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    error: 'Internal Server Error',
    message: err.message
  });
});

export default apiApp;
