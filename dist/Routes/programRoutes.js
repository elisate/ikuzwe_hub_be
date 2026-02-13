"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const programController_1 = require("../controllers/programController");
const multer_1 = require("../middlewares/multer");
const router = (0, express_1.Router)();
router.post('/createProgram', multer_1.upload.single('img'), programController_1.createProgram); // Handles image upload
router.get('/getAllPrograms', programController_1.getAllPrograms);
router.get('/getProgramById/:id', programController_1.getProgramById);
router.put('/updateProgram/:id', multer_1.upload.single('img'), programController_1.updateProgram); // Can update image too
router.delete('/deleteProgram/:id', programController_1.deleteProgram);
exports.default = router;
