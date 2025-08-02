// Import
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

// Initialize Prisma Client
const prisma = new PrismaClient();

// Controller to get all teams with product owner and project manager usernames
export const getTeams = async (req: Request, res: Response): Promise<void> => {
  try {
    const teams = await prisma.team.findMany();

    // Map through teams to get product owner and project manager usernames
    const teamsWithUsernames = await Promise.all(
      teams.map(async (team: any) => {
        const productOwner = await prisma.user.findUnique({
          where: { user_ID: team.productOwneruserId! },
          select: { username: true },
        });

        // map through project managers to get usernames
        const projectManager = await prisma.user.findUnique({
          where: { user_ID: team.projectManageruserId! },
          select: { username: true },
        });

        // Return the team with usernames
        return {
          ...team,
          productOwnerUsername: productOwner?.username,
          projectManagerUsername: projectManager?.username,
        };
      })
    );
    // Send the response with teams and their usernames
    res.json(teamsWithUsernames);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving teams: ${error.message}` });
  }
};