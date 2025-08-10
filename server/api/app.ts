import express, { Request, Response, NextFunction, Application } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";

import projectRoutes from "../src/routes/projectRoutes";
import taskRoutes from "../src/routes/taskRoutes";
import searchRoutes from "../src/routes/searchRoutes";
import userRoutes from "../src/routes/userRoutes";
import teamRoutes from "../src/routes/teamRoutes";

const allowedOrigins = [
  'https://agile-task-manager-client.vercel.app',
  /\.vercel\.app$/  // regex for any Vercel preview deployment
];

const apiApp: Application = express();

// Replace helmet with manual security headers
apiApp.use((req, res, next) => {
  // Basic security headers
  res.setHeader('X-DNS-Prefetch-Control', 'off');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Cross-Origin headers
  const origin = req.headers.origin;
  if (origin && allowedOrigins.some(o => 
    typeof o === 'string' ? o === origin : o.test(origin)
  )) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  
  next();
});

apiApp.use(morgan("dev"));
apiApp.use(express.json());
apiApp.use(bodyParser.json());
apiApp.use(bodyParser.urlencoded({ extended: false }));

apiApp.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// API Root
apiApp.get('/api', (req: Request, res: Response) => {
  res.json({
    message: "API Root. Available endpoints:",
    endpoints: [
      '/api/projects',
      '/api/tasks',
      '/api/search',
      '/api/users',
      '/api/teams',
      '/api/priority/:level'
    ]
  });
});

// API Routes with /api prefix
apiApp.use('/api/projects', projectRoutes);
apiApp.use('/api/tasks', taskRoutes);
apiApp.use('/api/search', searchRoutes);
apiApp.use('/api/users', userRoutes);
apiApp.use('/api/teams', teamRoutes);

apiApp.get('/api/priority/:level', (req: Request, res: Response) => {
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
  res.status(404).json({
    status: 'error',
    message: 'Endpoint not found',
    requestedUrl: req.originalUrl
  });
});

// Error handler
apiApp.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    error: 'Internal Server Error',
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

export default apiApp;