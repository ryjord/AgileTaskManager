import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'GET') {
    const { cognitoId } = req.query;
    try {
      const user = await prisma.user.findUnique({
        where: { cognito_ID: cognitoId as string },
      });
      res.status(200).json(user);
    } catch (error: any) {
      res.status(500).json({ message: `Error retrieving user: ${error.message}` });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
