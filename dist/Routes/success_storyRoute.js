"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sucess_storyController_1 = require("../controllers/sucess_storyController");
const multer_1 = require("../middlewares/multer");
const success_storyRouter = (0, express_1.Router)();
success_storyRouter.post('/createSuccessStory', multer_1.upload.single('img'), sucess_storyController_1.createSuccessStory);
success_storyRouter.get('/getAllStories', sucess_storyController_1.getAllStories);
success_storyRouter.get('/getStoryById/:id', sucess_storyController_1.getStoryById);
// Updated: Allow image upload during update
success_storyRouter.patch('/updateStory/:id', multer_1.upload.single('img'), sucess_storyController_1.updateStory);
success_storyRouter.delete('/deleteStory/:id', sucess_storyController_1.deleteStory);
exports.default = success_storyRouter;
