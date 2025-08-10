import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const { limit } = req.query;
  // TODO: Replace with real DB logic
  res.status(200).json({
    projects: [],
    message: `Fetched projects${limit ? ` with limit=${limit}` : ''}`
  });
}
