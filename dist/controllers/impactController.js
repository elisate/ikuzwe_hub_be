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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImpact = exports.updateImpact = exports.createImpact = exports.getAllImpacts = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// GET ALL - No more .split() needed!
const getAllImpacts = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const impacts = yield prisma.impact.findMany();
        res.status(200).json(impacts);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getAllImpacts = getAllImpacts;
// CREATE - Stores as ["ccc", "hom"]
const createImpact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, actions_keypoints } = req.body;
        const imgUrl = req.file ? req.file.path : null;
        // Ensure it's an array even if the frontend sends a single string
        const keypointsArray = Array.isArray(actions_keypoints)
            ? actions_keypoints
            : actions_keypoints ? [actions_keypoints] : [];
        const newImpact = yield prisma.impact.create({
            data: {
                title,
                description,
                img: imgUrl,
                actions_keypoints: keypointsArray,
            },
        });
        res.status(201).json(newImpact);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.createImpact = createImpact;
// UPDATE
const updateImpact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const _a = req.body, { actions_keypoints } = _a, otherData = __rest(_a, ["actions_keypoints"]);
        let dataToUpdate = Object.assign({}, otherData);
        if (req.file) {
            dataToUpdate.img = req.file.path;
        }
        if (actions_keypoints !== undefined) {
            dataToUpdate.actions_keypoints = Array.isArray(actions_keypoints)
                ? actions_keypoints
                : [actions_keypoints];
        }
        const updated = yield prisma.impact.update({
            where: { id },
            data: dataToUpdate,
        });
        res.status(200).json(updated);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.updateImpact = updateImpact;
// DELETE
const deleteImpact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Check if the impact exists first to provide a cleaner error message
        const existingImpact = yield prisma.impact.findUnique({
            where: { id },
        });
        if (!existingImpact) {
            res.status(404).json({ error: "Impact record not found" });
            return;
        }
        yield prisma.impact.delete({
            where: { id },
        });
        res.status(200).json({ message: "Impact deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.deleteImpact = deleteImpact;
