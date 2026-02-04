import jwt from 'jsonwebtoken';
import { UserRole } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key';

// Interface representing the full user details inside the token
interface TokenPayload {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  avatar: string | null;
  createdAt: Date;
}

/**
 * Generates a JWT token containing the complete user profile
 */
export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '1d',
  });
};