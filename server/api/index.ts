import type { VercelRequest, VercelResponse } from '@vercel/node';
import serverless from 'serverless-http'; // ✅ This is the NPM package
import apiApp from './app';

// Wrap the Express app in a serverless handler
const handler = serverless(apiApp);

export default (req: VercelRequest, res: VercelResponse) => {
  return handler(req, res);
};
