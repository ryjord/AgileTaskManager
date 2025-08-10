import type { VercelRequest, VercelResponse } from '@vercel/node';

const ALLOWED_ORIGIN = 'https://agile-task-manager-client.vercel.app';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  const { limit } = req.query;
  res.status(200).json({
    projects: [],
    message: `Fetched projects${limit ? ` with limit=${limit}` : ''}`
  });
}
