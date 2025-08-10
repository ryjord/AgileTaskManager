import type { VercelRequest, VercelResponse } from '@vercel/node';
import serverless from 'serverless-http';
import { execSync } from 'child_process';
import apiApp from './app';

// Generate Prisma Client if not already done (for Data Proxy)
try {
  execSync('prisma generate --data-proxy', { stdio: 'inherit' });
} catch (error) {
  console.error('Failed to generate Prisma client:', error);
}

const handler = serverless(apiApp);

export default (req: VercelRequest, res: VercelResponse) => {
  return handler(req, res);
};