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
exports.deleteStory = exports.updateStory = exports.getStoryById = exports.getAllStories = exports.createSuccessStory = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// CREATE
const createSuccessStory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description } = req.body;
        // Multer puts the Cloudinary info in req.file
        const imageUrl = req.file ? req.file.path : null;
        const story = yield prisma.sucessStory.create({
            data: {
                title,
                description,
                img: imageUrl // Save the secure URL from Cloudinary
            }
        });
        res.status(201).json(story);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create success story" });
    }
});
exports.createSuccessStory = createSuccessStory;
// READ ALL
const getAllStories = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stories = yield prisma.sucessStory.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(stories);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch stories" });
    }
});
exports.getAllStories = getAllStories;
// UPDATE
// GET BY ID
const getStoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const story = yield prisma.sucessStory.findUnique({
            where: { id }
        });
        if (!story) {
            return res.status(404).json({ error: "Story not found" });
        }
        res.json(story);
    }
    catch (error) {
        res.status(500).json({ error: "Error fetching story" });
    }
});
exports.getStoryById = getStoryById;
// UPDATE STORY
const updateStory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const { title, description } = req.body;
        // Check if a new file was uploaded via Multer
        // If yes, use the new Cloudinary path. If no, it stays as it was.
        const updateData = {
            title,
            description,
        };
        if (req.file) {
            updateData.img = req.file.path; // Update with new Cloudinary URL
        }
        const updated = yield prisma.sucessStory.update({
            where: { id },
            data: updateData
        });
        res.json(updated);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update story" });
    }
});
exports.updateStory = updateStory;
// DELETE
const deleteStory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma.sucessStory.delete({ where: { id: req.params.id } });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: "Failed to delete story" });
    }
});
exports.deleteStory = deleteStory;
