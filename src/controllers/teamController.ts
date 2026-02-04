import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 1. CREATE - Add a new team member
export const createMember = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { name, role, description, phone, email, socialsMedia } = req.body;
    
    // Get image URL from Multer (Cloudinary)
    const profileUrl = req.file ? req.file.path : null;

    const newMember = await prisma.teamMember.create({
      data: {
        name,
        role,
        description,
        phone,
        email,
        socialsMedia,
        profile: profileUrl,
      },
    });

    return res.status(201).json(newMember);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

// 2. READ ALL - Get all team members
export const getAllMembers = async (req: Request, res: Response): Promise<Response> => {
  try {
    const members = await prisma.teamMember.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return res.json(members);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

// 3. READ ONE - Get member by ID
export const getMemberById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const member = await prisma.teamMember.findUnique({
      where: { id: Number(id) }
    });

    if (!member) return res.status(404).json({ message: "Team member not found" });

    return res.json(member);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

// 4. UPDATE - Update details or profile picture
export const updateMember = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // If a new file is uploaded, update the profile field
    if (req.file) {
      updateData.profile = req.file.path;
    }

    const updatedMember = await prisma.teamMember.update({
      where: { id: Number(id) },
      data: updateData
    });

    return res.json(updatedMember);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

// 5. DELETE - Remove a team member
export const deleteMember = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;

    await prisma.teamMember.delete({
      where: { id: Number(id) }
    });

    return res.json({ message: "Team member removed successfully" });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};