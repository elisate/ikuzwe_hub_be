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
exports.deleteMember = exports.updateMember = exports.getMemberById = exports.getAllMembers = exports.createMember = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// 1. CREATE - Add a new team member
const createMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, role, description, phone, email, socialsMedia } = req.body;
        // Get image URL from Multer (Cloudinary)
        const profileUrl = req.file ? req.file.path : null;
        const newMember = yield prisma.teamMember.create({
            data: {
                name,
                role,
                description,
                phone,
                email,
                socialsMedia,
                profile: profileUrl,
            },
        });
        return res.status(201).json(newMember);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.createMember = createMember;
// 2. READ ALL - Get all team members
const getAllMembers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const members = yield prisma.teamMember.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return res.json(members);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.getAllMembers = getAllMembers;
// 3. READ ONE - Get member by ID (UUID)
const getMemberById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; // Already a string
        const member = yield prisma.teamMember.findUnique({
            where: { id } // Removed Number(id)
        });
        if (!member)
            return res.status(404).json({ message: "Team member not found" });
        return res.json(member);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.getMemberById = getMemberById;
// 4. UPDATE - Update details or profile picture (UUID)
const updateMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updateData = Object.assign({}, req.body);
        // If a new file is uploaded, update the profile field
        if (req.file) {
            updateData.profile = req.file.path;
        }
        const updatedMember = yield prisma.teamMember.update({
            where: { id }, // Removed Number(id)
            data: updateData
        });
        return res.json(updatedMember);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.updateMember = updateMember;
// 5. DELETE - Remove a team member (UUID)
const deleteMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma.teamMember.delete({
            where: { id } // Removed Number(id)
        });
        return res.json({ message: "Team member removed successfully" });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.deleteMember = deleteMember;
