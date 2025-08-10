import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'GET') {
    try {
      const teams = await prisma.team.findMany();
      const teamsWithUsernames = await Promise.all(
        teams.map(async (team: any) => {
          const productOwner = await prisma.user.findUnique({
            where: { user_ID: team.productOwneruser_ID },
            select: { username: true },
          });
          const projectManager = await prisma.user.findUnique({
            where: { user_ID: team.projectManageruser_ID },
            select: { username: true },
          });
          return {
            ...team,
            productOwnerUsername: productOwner?.username,
            projectManagerUsername: projectManager?.username,
          };
        })
      );
      res.status(200).json(teamsWithUsernames);
    } catch (error: any) {
      res.status(500).json({ message: `Error retrieving teams: ${error.message}` });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
