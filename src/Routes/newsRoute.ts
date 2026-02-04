import { Router } from 'express';
import { createNews, getAllNews, deleteNews, updateNews } from '../controllers/newsController';
import { upload } from '../middlewares/multer';


const newsRouter = Router();

// 'images' is the key name for Postman
newsRouter.post('/createNews ', upload.array('images', 10), createNews); 
newsRouter.get('/getAllNews', getAllNews);
newsRouter.delete('/deleteNews/:id', deleteNews);
// in src/routes/news.routes.ts
newsRouter.put('/updateNews/:id', upload.array('images', 10), updateNews);

export default newsRouter;