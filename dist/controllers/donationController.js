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
exports.deleteDonation = exports.updateDonationStatus = exports.getDonations = exports.createDonation = void 0;
const client_1 = require("@prisma/client");
const status = client_1.$Enums.DonationStatus.PENDING;
const prisma = new client_1.PrismaClient();
const createDonation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { donorName, donorEmail, donorPhone, amount, paymentMethod } = req.body;
        const donation = yield prisma.donation.create({
            data: {
                donorName,
                donorEmail,
                donorPhone,
                amount: parseFloat(amount), // Ensure it's a number
                paymentMethod,
                status: 'PENDING' // Default status
            }
        });
        res.status(201).json(donation);
    }
    catch (error) {
        res.status(500).json({ error: "Error creating donation" });
    }
});
exports.createDonation = createDonation;
const getDonations = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const donations = yield prisma.donation.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(donations);
    }
    catch (error) {
        res.status(500).json({ error: "Error fetching donations" });
    }
});
exports.getDonations = getDonations;
const updateDonationStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body;
    // Basic validation to prevent crashing if status is missing
    if (!status) {
        return res.status(400).json({ error: "Status is required" });
    }
    try {
        const updated = yield prisma.donation.update({
            where: { id: id },
            data: {
                // Force uppercase to match Prisma Enum (e.g., "completed" -> "COMPLETED")
                status: status.toUpperCase()
            }
        });
        res.json(updated);
    }
    catch (error) {
        // Log the error to your VS Code/Terminal console so you can see exactly why it failed
        console.error("Prisma Update Error:", error);
        res.status(500).json({
            error: "Error updating status",
            message: error.message
        });
    }
});
exports.updateDonationStatus = updateDonationStatus;
const deleteDonation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma.donation.delete({ where: { id: req.params.id } });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: "Error deleting donation" });
    }
});
exports.deleteDonation = deleteDonation;
