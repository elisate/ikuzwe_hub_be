"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contactController_1 = require("../controllers/contactController");
const contactRouter = (0, express_1.Router)();
contactRouter.post('/createContact', contactController_1.createContact); // Public route
contactRouter.get('/getAllContacts', contactController_1.getAllContacts); // Should be Admin only
contactRouter.get('/getContactById/:id', contactController_1.getContactById); // Should be Admin only
contactRouter.delete('/deleteContact/:id', contactController_1.deleteContact); // Should be Admin only
exports.default = contactRouter;
