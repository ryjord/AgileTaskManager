import { NextApiRequest, NextApiResponse } from 'next';

const mockTasks = {
  urgent: [{ id: 1, title: 'Fix production bug', priority: 'urgent' }],
  high: [{ id: 2, title: 'Prepare release', priority: 'high' }],
  medium: [{ id: 3, title: 'Write docs', priority: 'medium' }],
  backlog: [{ id: 4, title: 'Refactor code', priority: 'backlog' }],
  low: [{ id: 5, title: 'Update dependencies', priority: 'low' }],
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const {
    query: { level },
  } = req;

  if (typeof level !== 'string' || !(level in mockTasks)) {
    res.status(404).json({ error: 'Priority not found' });
    return;
  }

  res.status(200).json({ priority: level, tasks: mockTasks[level] });
}
