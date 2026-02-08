import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET ALL - No more .split() needed!
export const getAllImpacts = async (_req: Request, res: Response): Promise<void> => {
  try {
    const impacts = await prisma.impact.findMany();
    res.status(200).json(impacts); 
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// CREATE - Stores as ["ccc", "hom"]
export const createImpact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, actions_keypoints } = req.body;
    const imgUrl = req.file ? req.file.path : null;

    // Ensure it's an array even if the frontend sends a single string
    const keypointsArray = Array.isArray(actions_keypoints) 
      ? actions_keypoints 
      : actions_keypoints ? [actions_keypoints] : [];

    const newImpact = await prisma.impact.create({
      data: {
        title,
        description,
        img: imgUrl,
        actions_keypoints: keypointsArray, 
      },
    });

    res.status(201).json(newImpact);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE
export const updateImpact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { actions_keypoints, ...otherData } = req.body;

    let dataToUpdate: any = { ...otherData };

    if (req.file) {
      dataToUpdate.img = req.file.path;
    }

    if (actions_keypoints !== undefined) {
      dataToUpdate.actions_keypoints = Array.isArray(actions_keypoints)
        ? actions_keypoints
        : [actions_keypoints];
    }

    const updated = await prisma.impact.update({
      where: { id },
      data: dataToUpdate,
    });

    res.status(200).json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE
export const deleteImpact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Check if the impact exists first to provide a cleaner error message
    const existingImpact = await prisma.impact.findUnique({
      where: { id },
    });

    if (!existingImpact) {
      res.status(404).json({ error: "Impact record not found" });
      return;
    }

    await prisma.impact.delete({
      where: { id },
    });

    res.status(200).json({ message: "Impact deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};