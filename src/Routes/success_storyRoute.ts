import { Router } from 'express';
import { 
  createSuccessStory, 
  getAllStories, 
  updateStory, 
  deleteStory, 
  getStoryById
} from '../controllers/sucess_storyController';
import router from './teamRoutes';
import { upload } from '../middlewares/multer';
const success_storyRouter = Router();

success_storyRouter.post('/createSuccessStory', upload.single('img'), createSuccessStory);
success_storyRouter.get('/getAllStories', getAllStories);
success_storyRouter.get('/getStoryById/:id', getStoryById); 

// Updated: Allow image upload during update
success_storyRouter.patch('/updateStory/:id', upload.single('img'), updateStory);
success_storyRouter.delete('/deleteStory/:id', deleteStory);

export default success_storyRouter;