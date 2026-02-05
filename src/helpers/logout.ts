import { Request, Response } from 'express';

/**
 * Independent Logout Handler
 * Clears server-side cookies and signals frontend to wipe local storage.
 */
export const logoutHandler = async (req: Request, res: Response): Promise<Response> => {
  try {
    // 1. Clear the HTTP-only cookie if it exists
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/' // Ensure it clears for all paths
    });

    // 2. Return success
    return res.status(200).json({ 
      success: true,
      message: "Logged out successfully. Please clear your local storage." 
    });
    
  } catch (error) {
    return res.status(500).json({ 
      success: false,
      error: (error as Error).message 
    });
  }
};