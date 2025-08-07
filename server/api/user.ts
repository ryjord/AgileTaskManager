import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const users = await prisma.user.findMany();
      res.status(200).json(users);
    } catch (error: any) {
      res.status(500).json({ message: `Error retrieving users: ${error.message}` });
    }
  } else if (req.method === 'POST') {
    try {
      const { username, cognito_ID, profilePictureUrl = "i1.jpg", team_ID = 1 } = req.body;
      const newUser = await prisma.user.create({
        data: { username, cognito_ID, profilePictureUrl, team_ID },
      });
      res.status(201).json({ message: "User Created Successfully", newUser });
    } catch (error: any) {
      res.status(500).json({ message: `Error creating user: ${error.message}` });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
