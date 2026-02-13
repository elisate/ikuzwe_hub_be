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
exports.deleteAchievement = exports.updateAchievement = exports.getAchievementById = exports.getAllAchievements = exports.createAchievement = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// 1. Create a new Achievement
const createAchievement = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description } = req.body;
        const achievement = yield prisma.keyAchievement.create({
            data: { title, description },
        });
        res.status(201).json(achievement);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to create achievement" });
    }
});
exports.createAchievement = createAchievement;
// 2. Get all Achievements
const getAllAchievements = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const achievements = yield prisma.keyAchievement.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json(achievements);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch achievements" });
    }
});
exports.getAllAchievements = getAllAchievements;
// 3. Get a single Achievement by ID
const getAchievementById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; // UUID string
        const achievement = yield prisma.keyAchievement.findUnique({
            where: { id },
        });
        if (!achievement) {
            return res.status(404).json({ error: "Achievement not found" });
        }
        res.status(200).json(achievement);
    }
    catch (error) {
        res.status(500).json({ error: "Error fetching achievement" });
    }
});
exports.getAchievementById = getAchievementById;
// 4. Update an Achievement
const updateAchievement = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { title, description } = req.body;
        const updated = yield prisma.keyAchievement.update({
            where: { id },
            data: { title, description },
        });
        res.status(200).json(updated);
    }
    catch (error) {
        res.status(500).json({ error: "Update failed. Ensure ID is valid." });
    }
});
exports.updateAchievement = updateAchievement;
// 5. Delete an Achievement
const deleteAchievement = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma.keyAchievement.delete({
            where: { id },
        });
        res.status(204).send();
    }
    catch (error) {
        // If you have a cascade relation, Prisma handles child deletions,
        // otherwise, this might throw an error if restricted.
        res.status(500).json({ error: "Delete failed." });
    }
});
exports.deleteAchievement = deleteAchievement;
