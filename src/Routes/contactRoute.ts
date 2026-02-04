import { Router } from 'express';
import { 
  createContact, 
  getAllContacts, 
  getContactById, 
  deleteContact 
} from '../controllers/contactController';


const contactRouter = Router();

contactRouter.post('/createContact', createContact);       // Public route
contactRouter.get('/getAllContacts', getAllContacts);       // Should be Admin only
contactRouter.get('/getContactById/:id', getContactById);    // Should be Admin only
contactRouter.delete('/deleteContact/:id', deleteContact); // Should be Admin only

export default contactRouter;