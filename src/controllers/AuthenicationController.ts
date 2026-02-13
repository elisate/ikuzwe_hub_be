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
// 2. Check if they are active BEFORE allowing the login to finish
  if (!user.isActive) {
    return res.status(403).json({ message: "Your account is deactivated." });
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
    // With Multer, these fields come from req.body
    const { id, firstName, lastName, email, avatar } = req.body;

    // 1. Check if ID exists to avoid Prisma crash
    if (!id) {
      return res.status(400).json({ 
        message: "Missing User ID. Please ensure 'id' is sent in the form-data." 
      });
    }

    const avatarUrl = req.file ? req.file.path : avatar;

    // 2. Perform the Update
    const updatedUser = await prisma.user.update({
      where: { id: id }, // Prisma now gets the UUID string correctly
      data: {
        firstName,
        lastName,
        email,
        avatar: avatarUrl,
      },
    });

    return res.status(200).json({
      message: "Update successful",
      user: updatedUser
    });

  } catch (error) {
    // If the UUID is formatted incorrectly, Prisma throws a specific error
    return res.status(500).json({ error: (error as Error).message });
  }
};