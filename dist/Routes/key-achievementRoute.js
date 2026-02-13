"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const key_achievement_1 = require("../controllers/key-achievement"); // Adjust the path as needed
const achievementRouter = (0, express_1.Router)();
achievementRouter.post('/createAchievement/', key_achievement_1.createAchievement);
achievementRouter.get('/getAllAchievements/', key_achievement_1.getAllAchievements);
achievementRouter.get('/getAchievementById/:id', key_achievement_1.getAchievementById);
achievementRouter.put('/updateAchievement/:id', key_achievement_1.updateAchievement);
achievementRouter.delete('/deleteAchievement/:id', key_achievement_1.deleteAchievement);
exports.default = achievementRouter;
