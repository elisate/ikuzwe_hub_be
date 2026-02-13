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
exports.deleteContact = exports.getContactById = exports.getAllContacts = exports.createContact = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// 1. CREATE - Submit a new contact message (Public)
const createContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, subject, email, message } = req.body;
        const newContact = yield prisma.contact.create({
            data: {
                firstName,
                lastName,
                subject,
                email,
                message,
            },
        });
        return res.status(201).json(newContact);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.createContact = createContact;
// 2. READ ALL - Get all messages (Admin only)
const getAllContacts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contacts = yield prisma.contact.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return res.json(contacts);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.getAllContacts = getAllContacts;
// 3. READ ONE - Get a specific message by UUID
const getContactById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const contact = yield prisma.contact.findUnique({
            where: { id }, // id is a UUID string
        });
        if (!contact)
            return res.status(404).json({ message: "Message not found" });
        return res.json(contact);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.getContactById = getContactById;
// 4. DELETE - Remove a contact message
const deleteContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma.contact.delete({
            where: { id },
        });
        return res.json({ message: "Contact message deleted successfully" });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.deleteContact = deleteContact;
