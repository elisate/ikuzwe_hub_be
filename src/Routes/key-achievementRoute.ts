import { Router } from 'express';
import {
  createAchievement,
  getAllAchievements,
  getAchievementById,
  updateAchievement,
  deleteAchievement
} from '../controllers/key-achievement'; // Adjust the path as needed

const achievementRouter = Router();
achievementRouter.post('/createAchievement/', createAchievement);
achievementRouter.get('/getAllAchievements/', getAllAchievements);
achievementRouter.get('/getAchievementById/:id', getAchievementById);
achievementRouter.put('/updateAchievement/:id', updateAchievement);
achievementRouter.delete('/deleteAchievement/:id', deleteAchievement);

export default achievementRouter;