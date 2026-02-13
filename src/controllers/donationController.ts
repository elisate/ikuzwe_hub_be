import { Request, Response } from 'express';
import { PrismaClient, DonationStatus } from '@prisma/client';

const prisma = new PrismaClient();

export const createDonation = async (req: Request, res: Response) => {
  try {
    const { donorName, donorEmail, donorPhone, amount, paymentMethod } = req.body;
    
    const donation = await prisma.donation.create({
      data: {
        donorName,
        donorEmail,
        donorPhone,
        amount: parseFloat(amount), // Ensure it's a number
        paymentMethod,
        status: 'PENDING' // Default status
      }
    });
    
    res.status(201).json(donation);
  } catch (error) {
    res.status(500).json({ error: "Error creating donation" });
  }
};

export const getDonations = async (_req: Request, res: Response) => {
  try {
    const donations = await prisma.donation.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ error: "Error fetching donations" });
  }
};

export const updateDonationStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body; 

  // Basic validation to prevent crashing if status is missing
  if (!status) {
    return res.status(400).json({ error: "Status is required" });
  }

  try {
    const updated = await prisma.donation.update({
      where: { id: id },
      data: { 
        // Force uppercase to match Prisma Enum (e.g., "completed" -> "COMPLETED")
        status: status.toUpperCase() as DonationStatus 
      }
    });
    
    res.json(updated);
  } catch (error: any) {
    // Log the error to your VS Code/Terminal console so you can see exactly why it failed
    console.error("Prisma Update Error:", error);

    res.status(500).json({ 
      error: "Error updating status",
      message: error.message 
    });
  }
};
export const deleteDonation = async (req: Request, res: Response) => {
  try {
    await prisma.donation.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Error deleting donation" });
  }
};