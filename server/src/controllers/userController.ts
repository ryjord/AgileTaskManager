// import
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { isDatabaseUnreachable, seededUsers } from "../../lib/seedFallback";

// Initialize Prisma Client
const prisma = new PrismaClient();

// User Controller Functions
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error: any) {
    if (isDatabaseUnreachable(error)) {
      res.json(seededUsers());
      return;
    }
    console.error("userController:", { message: error instanceof Error ? error.message : String(error) });
    res
      .status(500)
      .json({ message: "Error retrieving users." });
  }
};

// Get user by cognito ID
export const getUser = async (req: Request, res: Response): Promise<void> => {
  // Express types a route param as string | string[]; Prisma needs a string.
  const cognitoId = Array.isArray(req.params.cognitoId)
    ? req.params.cognitoId[0]
    : req.params.cognitoId;

  if (!cognitoId) {
    res.status(400).json({ message: "A cognitoId is required" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        cognito_ID: cognitoId,
      },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(user);
  } catch (error: any) {
    console.error("userController:", { message: error instanceof Error ? error.message : String(error) });
    res
      .status(500)
      .json({ message: "Error retrieving user." });
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
    console.error("userController:", { message: error instanceof Error ? error.message : String(error) });
    res
      .status(500)
      .json({ message: "Error creating user." });
  }
};