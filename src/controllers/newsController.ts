import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createNews = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { title, content, category } = req.body;
    const files = req.files as Express.Multer.File[]; // Array of files from Cloudinary

    // Create News and its nested images in one transaction
    const newNews = await prisma.news.create({
      data: {
        title,
        content,
        category,
        images: {
          create: files.map((file) => ({
            url: file.path, // Cloudinary URL
          })),
        },
      },
      include: { images: true }, // Return the news with its images
    });

    return res.status(201).json(newNews);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

export const getAllNews = async (req: Request, res: Response): Promise<Response> => {
  try {
    const newsItems = await prisma.news.findMany({
      include: { images: true },
      orderBy: { createdAt: 'desc' },
    });
    return res.json(newsItems);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

export const deleteNews = async (req: Request, res: Response): Promise<Response> => {
  try {
   const { id } = req.params;

// No Number() conversion needed because UUID is a string
await prisma.news.delete({ 
  where: { id } 
});
    return res.json({ message: "News and related images deleted" });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

export const updateNews = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params; // UUID string from URL
    const { title, content, category } = req.body;
    const files = req.files as Express.Multer.File[]; 

    // 1. Prepare the update data for text fields
    const updateData: any = {
      title,
      content,
      category,
    };

    // 2. Add new images to the collection if they exist
    if (files && files.length > 0) {
      updateData.images = {
        create: files.map((file) => ({
          url: file.path,
        })),
      };
    }

    // 3. Perform update using the UUID string directly
    const updatedNews = await prisma.news.update({
      where: { id }, // REMOVED Number(id)
      data: updateData,
      include: { images: true }, 
    });

    return res.json(updatedNews);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};