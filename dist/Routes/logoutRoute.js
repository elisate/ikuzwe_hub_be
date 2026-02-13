"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const logout_1 = require("../helpers/logout"); // Import the component
const logoutRouter = (0, express_1.Router)();
// We use 'protect' because only logged-in users need to log out
logoutRouter.post('/logout', logout_1.logoutHandler);
exports.default = logoutRouter;
