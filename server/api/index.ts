import type { VercelRequest, VercelResponse } from '@vercel/node';
import serverless from 'serverless-http';
import { execSync } from 'child_process';
import apiApp from './app';

const handler = serverless(apiApp);

export default (req: VercelRequest, res: VercelResponse) => {
  return handler(req, res);
};