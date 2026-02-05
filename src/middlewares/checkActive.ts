import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const checkActiveStatus = async (req: Request, res: Response, next: NextFunction) => {
  // Assuming your auth middleware puts the user ID in req.user
  const userId = (req as any).user?.id; 

  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user || !user.isActive) {
    return res.status(403).json({ message: "Your account is deactivated. Please contact support." });
  }

  next();
};