import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const { project_ID } = req.query;
  // TODO: Replace with real DB logic
  res.status(200).json({
    tasks: [],
    message: `Fetched tasks${project_ID ? ` for project_ID=${project_ID}` : ''}`
  });
}
