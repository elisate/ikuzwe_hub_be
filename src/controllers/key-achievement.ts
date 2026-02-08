import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 1. Create a new Achievement
export const createAchievement = async (req: Request, res: Response) => {
  try {
    const { title, description }: { title: string; description?: string } = req.body;
    
    const achievement = await prisma.keyAchievement.create({
      data: { title, description },
    });
    
    res.status(201).json(achievement);
  } catch (error) {
    res.status(500).json({ error: "Failed to create achievement" });
  }
};

// 2. Get all Achievements
export const getAllAchievements = async (_req: Request, res: Response) => {
  try {
    const achievements = await prisma.keyAchievement.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(achievements);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch achievements" });
  }
};

// 3. Get a single Achievement by ID
export const getAchievementById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // UUID string
    const achievement = await prisma.keyAchievement.findUnique({
      where: { id },
    });
    
    if (!achievement) {
      return res.status(404).json({ error: "Achievement not found" });
    }
    
    res.status(200).json(achievement);
  } catch (error) {
    res.status(500).json({ error: "Error fetching achievement" });
  }
};

// 4. Update an Achievement
export const updateAchievement = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description }: { title?: string; description?: string } = req.body;

    const updated = await prisma.keyAchievement.update({
      where: { id },
      data: { title, description },
    });
    
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: "Update failed. Ensure ID is valid." });
  }
};

// 5. Delete an Achievement
export const deleteAchievement = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await prisma.keyAchievement.delete({
      where: { id },
    });
    
    res.status(204).send(); 
  } catch (error) {
    // If you have a cascade relation, Prisma handles child deletions,
    // otherwise, this might throw an error if restricted.
    res.status(500).json({ error: "Delete failed." });
  }
};