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