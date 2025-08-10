import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response, Application } from "express";
import apiApp from "../api/app";

const app: Application = express();

// Root endpoint: show API info
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: "Server is running. All API endpoints are available under /api.",
    api: "/api"
  });
});

// Mount API app at /api
app.use('/api', apiApp);

// Server setup
const port: number = process.env.PORT ? parseInt(process.env.PORT) : 8000;
if (isNaN(port)) {
  console.error(`Invalid PORT value "${process.env.PORT}". Falling back to 8000.`);
}

app.listen(port, () => {
  console.log(`Server Running On Port: ${port}`);
  console.log(`API available at: http://localhost:${port}/api`);
});