"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const newsController_1 = require("../controllers/newsController");
const multer_1 = require("../middlewares/multer");
const newsRouter = (0, express_1.Router)();
// 'images' is the key name for Postman
newsRouter.post('/createNews', multer_1.upload.array('images', 10), newsController_1.createNews);
newsRouter.get('/getAllNews', newsController_1.getAllNews);
newsRouter.delete('/deleteNews/:id', newsController_1.deleteNews);
// in src/routes/news.routes.ts
newsRouter.put('/updateNews/:id', multer_1.upload.array('images', 10), newsController_1.updateNews);
exports.default = newsRouter;
