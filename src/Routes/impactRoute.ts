import { Router } from 'express';
import { createImpact,getAllImpacts, updateImpact,deleteImpact } from '../controllers/impactController';
import { upload } from '../middlewares/multer';

const impactRouter = Router();
impactRouter.get('/getAll', getAllImpacts);
impactRouter.post('/create', upload.single('img'),createImpact);
impactRouter.put('/update/:id', upload.single('img'),updateImpact);
impactRouter.delete('/delete/:id', deleteImpact);

export default impactRouter;