import { PrismaClient } from "@prisma/client";
import { Response, Request } from "express";

export const getProjects = (prisma: PrismaClient) => async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const limit = (() => {
            const val = parseInt(req.query.limit as string);
            if (isNaN(val) || val <= 0) return 10;
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
        });
        res.status(200).json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({message: "error"});
    }
};