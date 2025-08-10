import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'GET') {
    try {
      const limit = (() => {
        const val = parseInt(req.query.limit as string);
        if (isNaN(val) || val <= 0 || val > 100) return 100;
        return val;
      })();
      const offset = (() => {
        const val = parseInt(req.query.offset as string);
        if (isNaN(val) || val < 0) return 0;
        return val;
      })();
      const projects = await prisma.project.findMany({
        skip: offset,
        take: limit,
        select: {
          project_ID: true,
          name: true,
          description: true,
          startDate: true,
          endDate: true
        }
      });
      const total = await prisma.project.count();
      res.status(200).json({
        data: projects,
        meta: { total, limit, offset }
      });
    } catch (error: any) {
      res.status(500).json({
        message: "An error occurred while processing your request.",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  } else if (req.method === 'POST') {
    const { name, description, startDate, endDate } = req.body;
    if (!name || !startDate || !endDate) {
      res.status(400).json({ message: "Missing required fields: name, startDate, endDate" });
      return;
    }
    if (
      typeof name !== "string" ||
      typeof description !== "string" ||
      !name.trim() ||
      !description.trim() ||
      isNaN(Date.parse(startDate)) ||
      isNaN(Date.parse(endDate))
    ) {
      res.status(400).json({ message: "Invalid input data" });
      return;
    }
    try {
      const newProject = await prisma.project.create({
        data: {
          name: name.trim(),
          description: description.trim(),
          startDate: new Date(startDate),
          endDate: new Date(endDate)
        }
      });
      res.status(201).json(newProject);
    } catch (error: any) {
      res.status(500).json({
        message: "An error occurred while processing your request.",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
