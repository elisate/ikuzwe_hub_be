import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 1. CREATE - Create a new program with an image
export const createProgram = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { title, description } = req.body;
    
    // Check if image was uploaded via Multer
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const newProgram = await prisma.progam.create({
      data: {
        title,
        description,
        img: req.file.path, // Cloudinary URL from Multer
      },
    });

    return res.status(201).json(newProgram);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

// 2. READ ALL - Get all programs
export const getAllPrograms = async (req: Request, res: Response): Promise<Response> => {
  try {
    const programs = await prisma.progam.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return res.json(programs);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

// 3. READ ONE - Get a single program by ID
// 3. READ ONE - Get a single program by ID (UUID)
export const getProgramById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params; 
    
    const program = await prisma.progam.findUnique({
      where: { id } // Removed Number(id)
    });

    if (!program) return res.status(404).json({ message: "Program not found" });

    return res.json(program);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

// 4. UPDATE - Update title, description, or image (UUID)
export const updateProgram = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const updateData: any = { title, description };

    if (req.file) {
      updateData.img = req.file.path;
    }

    const updatedProgram = await prisma.progam.update({
      where: { id }, // Removed Number(id)
      data: updateData
    });

    return res.json(updatedProgram);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

// 5. DELETE - Remove a program (UUID)
export const deleteProgram = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;

    await prisma.progam.delete({
      where: { id } // Removed Number(id)
    });

    return res.json({ message: "Program deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};