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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.toggleUserStatus = exports.getAllUsers = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const tokenGenerator_1 = require("../utilis/tokenGenerator");
const client_1 = require("@prisma/client");
const UserRole = client_1.$Enums.UserRole.USER;
const prisma = new client_1.PrismaClient();
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, password, role } = req.body;
        const existingUser = yield prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        // Capture the avatar URL from Multer (Cloudinary)
        const avatarUrl = req.file ? req.file.path : req.body.avatar;
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        const newUser = yield prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword,
                avatar: avatarUrl, // Now supports both file upload and string URL
                role: role
            }
        });
        const { password: _ } = newUser, userWithoutPassword = __rest(newUser, ["password"]);
        return res.status(201).json(userWithoutPassword);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield prisma.user.findUnique({ where: { email } });
        if (!user || !(yield bcryptjs_1.default.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        // 2. Check if they are active BEFORE allowing the login to finish
        if (!user.isActive) {
            return res.status(403).json({ message: "Your account is deactivated." });
        }
        // Generate token with "Full Details"
        const token = (0, tokenGenerator_1.generateToken)({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            createdAt: user.createdAt
        });
        // Return the token and the user info to the client
        const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
        return res.json({
            token,
            user: userWithoutPassword
        });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.login = login;
// Get all users
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.user.findMany({
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
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.getAllUsers = getAllUsers;
// Toggle User Status (Activate/Deactivate)
const toggleUserStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // 1. Find user first to see current status
        const user = yield prisma.user.findUnique({ where: { id } });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        // 2. Flip the boolean (if true, becomes false)
        const updatedUser = yield prisma.user.update({
            where: { id },
            data: { isActive: !user.isActive },
            select: { id: true, email: true, isActive: true }
        });
        return res.status(200).json({
            message: `User ${updatedUser.isActive ? 'activated' : 'deactivated'} successfully`,
            user: updatedUser
        });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.toggleUserStatus = toggleUserStatus;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const updatedUser = yield prisma.user.update({
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
    }
    catch (error) {
        // If the UUID is formatted incorrectly, Prisma throws a specific error
        return res.status(500).json({ error: error.message });
    }
});
exports.updateProfile = updateProfile;
