import { Request, Response } from 'express';
import { PrismaClient,UserRole} from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utilis/tokenGenerator';

const prisma = new PrismaClient();


export const register = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Capture the avatar URL from Multer (Cloudinary)
    const avatarUrl = req.file ? req.file.path : req.body.avatar;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        avatar: avatarUrl, // Now supports both file upload and string URL
        role: (role as UserRole) || UserRole.USER 
      }
    });

    const { password: _, ...userWithoutPassword } = newUser;
    return res.status(201).json(userWithoutPassword);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token with "Full Details"
    const token = generateToken({ 
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      createdAt: user.createdAt
    });

    // Return the token and the user info to the client
    const { password: _, ...userWithoutPassword } = user;
    
    return res.json({
      token,
      user: userWithoutPassword
    });

  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};



// Get all users
export const getAllUsers = async (req: Request, res: Response): Promise<Response> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        avatar: true,
        isActive: true, // Vital to see who is active
        createdAt: true
      }
    });
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

// Toggle User Status (Activate/Deactivate)
export const toggleUserStatus = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;

    // 1. Find user first to see current status
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2. Flip the boolean (if true, becomes false)
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
      select: { id: true, email: true, isActive: true }
    });

    return res.status(200).json({
      message: `User ${updatedUser.isActive ? 'activated' : 'deactivated'} successfully`,
      user: updatedUser
    });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<Response> => {
  try {
    // 1. Get User ID from the request (attached by your auth middleware)
    const userId = (req as any).user?.id; 

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: No user ID found" });
    }

    const { firstName, lastName, email } = req.body;

    // 2. Check if a new file was uploaded via Multer
    // If not, we keep the existing avatar URL from the body
    const avatarUrl = req.file ? req.file.path : req.body.avatar;

    // 3. Perform the update
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        email,
        avatar: avatarUrl,
      },
    });

    // 4. Remove password from response for security
    const { password: _, ...userWithoutPassword } = updatedUser;

    return res.status(200).json({
      message: "Profile updated successfully",
      user: userWithoutPassword
    });

  } catch (error) {
    // Handle Prisma specific errors (like email already taken)
    if ((error as any).code === 'P2002') {
      return res.status(400).json({ message: "Email is already in use by another account" });
    }
    return res.status(500).json({ error: (error as Error).message });
  }
};