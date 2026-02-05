import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// CREATE
export const createSuccessStory = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    
    // Multer puts the Cloudinary info in req.file
    const imageUrl = req.file ? req.file.path : null; 

    const story = await prisma.sucessStory.create({
      data: { 
        title, 
        description, 
        img: imageUrl // Save the secure URL from Cloudinary
      }
    });

    res.status(201).json(story);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create success story" });
  }
};

// READ ALL
export const getAllStories = async (_req: Request, res: Response) => {
  try {
    const stories = await prisma.sucessStory.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(stories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stories" });
  }
};

// UPDATE
// GET BY ID
export const getStoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const story = await prisma.sucessStory.findUnique({
      where: { id }
    });

    if (!story) {
      return res.status(404).json({ error: "Story not found" });
    }

    res.json(story);
  } catch (error) {
    res.status(500).json({ error: "Error fetching story" });
  }
};

// UPDATE STORY
export const updateStory = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const { title, description } = req.body;
    
    // Check if a new file was uploaded via Multer
    // If yes, use the new Cloudinary path. If no, it stays as it was.
    const updateData: any = {
      title,
      description,
    };

    if (req.file) {
      updateData.img = req.file.path; // Update with new Cloudinary URL
    }

    const updated = await prisma.sucessStory.update({
      where: { id },
      data: updateData
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update story" });
  }
};

// DELETE
export const deleteStory = async (req: Request, res: Response) => {
  try {
    await prisma.sucessStory.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete story" });
  }
};