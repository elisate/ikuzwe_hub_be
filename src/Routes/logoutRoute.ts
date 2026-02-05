import { Router } from 'express';
import { logoutHandler } from '../helpers/logout'; // Import the component
import router from './teamRoutes';


const logoutRouter = Router();

// We use 'protect' because only logged-in users need to log out
logoutRouter.post('/logout',  logoutHandler);
    
export default logoutRouter;