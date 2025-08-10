import type { VercelRequest, VercelResponse } from '@vercel/node';
import serverless from 'serverless-http';
import { PrismaClient } from '@prisma/client/edge'; // Use Edge Client for Data Proxy
import apiApp from './app';


const handler = serverless(apiApp);

export default async (req: VercelRequest, res: VercelResponse) => {
  return handler(req, res);
};