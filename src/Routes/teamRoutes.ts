import { Router } from 'express';
import { 
  createMember, 
  getAllMembers, 
  getMemberById, 
  updateMember, 
  deleteMember 
} from '../controllers/teamController';
import { upload } from '../middlewares/multer';

const router = Router();

router.post('/createMember', upload.single('profile'), createMember);
router.get('/getAllMembers', getAllMembers);
router.get('/getMemberById/:id', getMemberById);
router.put('/updateMember/:id', upload.single('profile'), updateMember);
router.delete('/deleteMember/:id', deleteMember);
export default router;