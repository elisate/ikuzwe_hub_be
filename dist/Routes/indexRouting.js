"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRoutes_1 = __importDefault(require("./authRoutes"));
const programRoutes_1 = __importDefault(require("./programRoutes"));
const teamRoutes_1 = __importDefault(require("./teamRoutes"));
const newsRoute_1 = __importDefault(require("./newsRoute"));
const contactRoute_1 = __importDefault(require("./contactRoute"));
const logoutRoute_1 = __importDefault(require("./logoutRoute"));
const donationRoute_1 = __importDefault(require("./donationRoute"));
const success_storyRoute_1 = __importDefault(require("./success_storyRoute"));
const key_achievementRoute_1 = __importDefault(require("./key-achievementRoute"));
const impactRoute_1 = __importDefault(require("./impactRoute"));
const mainRouter = (0, express_1.Router)();
mainRouter.use("/auth", authRoutes_1.default);
mainRouter.use("/program", programRoutes_1.default);
mainRouter.use("/team", teamRoutes_1.default);
mainRouter.use("/news", newsRoute_1.default);
mainRouter.use("/contact", contactRoute_1.default); // Add contact routes
mainRouter.use("/logout", logoutRoute_1.default); // Add logout routes
mainRouter.use("/donation", donationRoute_1.default); // Add logout routes
mainRouter.use("/success_story", success_storyRoute_1.default);
mainRouter.use("/achievement", key_achievementRoute_1.default);
mainRouter.use("/impact", impactRoute_1.default);
exports.default = mainRouter;
