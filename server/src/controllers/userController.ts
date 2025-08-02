// import
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

// Initialize Prisma Client
const prisma = new PrismaClient();

// User Controller Functions
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving users: ${error.message}` });
  }
};

// Get user by cognito ID
export const getUser = async (req: Request, res: Response): Promise<void> => {
  const { cognitoId } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: {
        cognito_ID: cognitoId,
      },
    });

    // If user not found, return 404
    res.json(user);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving user: ${error.message}` });
  }
};

// Create a new user
export const postUser = async (req: Request, res: Response) => {
  try {
    const {
      username,
      cognito_ID,
      profilePictureUrl = "i1.jpg",
      team_ID = 1,
    } = req.body;
    const newUser = await prisma.user.create({
      data: {
        username,
        cognito_ID,
        profilePictureUrl,
        team_ID,
      },
    });
    res.json({ message: "User Created Successfully", newUser });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving users: ${error.message}` });
  }
};