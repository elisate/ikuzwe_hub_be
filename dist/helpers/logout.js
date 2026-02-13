"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutHandler = void 0;
/**
 * Independent Logout Handler
 * Clears server-side cookies and signals frontend to wipe local storage.
 */
const logoutHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
exports.logoutHandler = logoutHandler;
