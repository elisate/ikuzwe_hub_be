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
exports.updateNews = exports.deleteNews = exports.getAllNews = exports.createNews = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, content, category } = req.body;
        const files = req.files; // Array of files from Cloudinary
        // Create News and its nested images in one transaction
        const newNews = yield prisma.news.create({
            data: {
                title,
                content,
                category,
                images: {
                    create: files.map((file) => ({
                        url: file.path, // Cloudinary URL
                    })),
                },
            },
            include: { images: true }, // Return the news with its images
        });
        return res.status(201).json(newNews);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.createNews = createNews;
const getAllNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newsItems = yield prisma.news.findMany({
            include: { images: true },
            orderBy: { createdAt: 'desc' },
        });
        return res.json(newsItems);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.getAllNews = getAllNews;
const deleteNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // No Number() conversion needed because UUID is a string
        yield prisma.news.delete({
            where: { id }
        });
        return res.json({ message: "News and related images deleted" });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.deleteNews = deleteNews;
const updateNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; // UUID string from URL
        const { title, content, category } = req.body;
        const files = req.files;
        // 1. Prepare the update data for text fields
        const updateData = {
            title,
            content,
            category,
        };
        // 2. Add new images to the collection if they exist
        if (files && files.length > 0) {
            updateData.images = {
                create: files.map((file) => ({
                    url: file.path,
                })),
            };
        }
        // 3. Perform update using the UUID string directly
        const updatedNews = yield prisma.news.update({
            where: { id }, // REMOVED Number(id)
            data: updateData,
            include: { images: true },
        });
        return res.json(updatedNews);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.updateNews = updateNews;
