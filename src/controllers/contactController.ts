import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 1. CREATE - Submit a new contact message (Public)
export const createContact = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { firstName, lastName, subject, email, message } = req.body;

    const newContact = await prisma.contact.create({
      data: {
        firstName,
        lastName,
        subject,
        email,
        message,
      },
    });

    return res.status(201).json(newContact);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

// 2. READ ALL - Get all messages (Admin only)
export const getAllContacts = async (req: Request, res: Response): Promise<Response> => {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return res.json(contacts);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

// 3. READ ONE - Get a specific message by UUID
export const getContactById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;

    const contact = await prisma.contact.findUnique({
      where: { id }, // id is a UUID string
    });

    if (!contact) return res.status(404).json({ message: "Message not found" });

    return res.json(contact);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

// 4. DELETE - Remove a contact message
export const deleteContact = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;

    await prisma.contact.delete({
      where: { id },
    });

    return res.json({ message: "Contact message deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};