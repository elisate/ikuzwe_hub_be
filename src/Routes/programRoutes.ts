import { Router } from 'express';
import { 
  createProgram, 
  getAllPrograms, 
  getProgramById, 
  updateProgram, 
  deleteProgram 
} from '../controllers/programController';
import { upload } from '../middlewares/multer';

const router = Router();

router.post('/createProgram', upload.single('img'), createProgram); // Handles image upload
router.get('/getAllPrograms', getAllPrograms);
router.get('/getProgramById/:id', getProgramById);
router.put('/updateProgram/:id', upload.single('img'), updateProgram); // Can update image too
router.delete('/deleteProgram/:id', deleteProgram);

export default router;