import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

  export const getAllImpacts = async (_req: Request, res: Response): Promise<void> => {
    try {
      const impacts = await prisma.impact.findMany();

      // Map over results to turn the string back into an array for the frontend
      const formattedImpacts = impacts.map((item) => ({
        ...item,
        actions_keypoints: item.actions_keypoints ? item.actions_keypoints.split(',') : [],
      }));

      res.status(200).json(formattedImpacts);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }



  // CREATE
  export const createImpact = async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, description, actions_keypoints } = req.body;
      
      // Get the image URL from the Multer middleware
      const imgUrl = req.file ? req.file.path : null;

      const formattedKeypoints = Array.isArray(actions_keypoints)
        ? actions_keypoints.join(',')
        : actions_keypoints;

      const newImpact = await prisma.impact.create({
        data: {
          title,
          description,
          img: imgUrl, // Save the Cloudinary URL
          actions_keypoints: formattedKeypoints,
        },
      });

      res.status(201).json(newImpact);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // UPDATE
  export const updateImpact = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { actions_keypoints, ...otherData } = req.body;

      let dataToUpdate: any = { ...otherData };

      // If a new file is uploaded, update the img field
      if (req.file) {
        dataToUpdate.img = req.file.path;
      }

      if (actions_keypoints !== undefined) {
        dataToUpdate.actions_keypoints = Array.isArray(actions_keypoints)
          ? actions_keypoints.join(',')
          : actions_keypoints;
      }

      const updated = await prisma.impact.update({
        where: { id },
        data: dataToUpdate,
      });

      res.status(200).json(updated);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET ALL & DELETE remain the same as previously provided...

  // DELETE
  export const deleteImpact = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await prisma.impact.delete({ where: { id } });
      res.status(200).json({ message: "Impact deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }



