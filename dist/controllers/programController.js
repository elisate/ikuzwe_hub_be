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
exports.deleteProgram = exports.updateProgram = exports.getProgramById = exports.getAllPrograms = exports.createProgram = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// 1. CREATE - Create a new program with an image
const createProgram = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description } = req.body;
        // Check if image was uploaded via Multer
        if (!req.file) {
            return res.status(400).json({ message: "Image is required" });
        }
        const newProgram = yield prisma.progam.create({
            data: {
                title,
                description,
                img: req.file.path, // Cloudinary URL from Multer
            },
        });
        return res.status(201).json(newProgram);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.createProgram = createProgram;
// 2. READ ALL - Get all programs
const getAllPrograms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const programs = yield prisma.progam.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return res.json(programs);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.getAllPrograms = getAllPrograms;
// 3. READ ONE - Get a single program by ID
// 3. READ ONE - Get a single program by ID (UUID)
const getProgramById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const program = yield prisma.progam.findUnique({
            where: { id } // Removed Number(id)
        });
        if (!program)
            return res.status(404).json({ message: "Program not found" });
        return res.json(program);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.getProgramById = getProgramById;
// 4. UPDATE - Update title, description, or image (UUID)
const updateProgram = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { title, description } = req.body;
        const updateData = { title, description };
        if (req.file) {
            updateData.img = req.file.path;
        }
        const updatedProgram = yield prisma.progam.update({
            where: { id }, // Removed Number(id)
            data: updateData
        });
        return res.json(updatedProgram);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.updateProgram = updateProgram;
// 5. DELETE - Remove a program (UUID)
const deleteProgram = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma.progam.delete({
            where: { id } // Removed Number(id)
        });
        return res.json({ message: "Program deleted successfully" });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.deleteProgram = deleteProgram;
