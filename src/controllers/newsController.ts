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
    // Because of 'onDelete: Cascade' in schema, this deletes images too!
    await prisma.news.delete({ where: { id: Number(id) } });
    return res.json({ message: "News and related images deleted" });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

export const updateNews = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const { title, content, category } = req.body;
    const files = req.files as Express.Multer.File[]; // New images from Cloudinary

    // 1. Prepare the update data for text fields
    const updateData: any = {
      title,
      content,
      category,
    };

    // 2. If new images are uploaded, use 'create' inside 'images' 
    // to add them to the existing list (Nested Update)
    if (files && files.length > 0) {
      updateData.images = {
        create: files.map((file) => ({
          url: file.path,
        })),
      };
    }

    const updatedNews = await prisma.news.update({
      where: { id: Number(id) },
      data: updateData,
      include: { images: true }, // Return the updated news with all images
    });

    return res.json(updatedNews);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};